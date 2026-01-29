import google.generativeai as genai
import os
import json
import logging
import traceback
from typing import Dict, List, Optional, Any
from dotenv import load_dotenv
from models import User, UserProfile, ShortlistedUniversity, University
from sqlalchemy.orm import Session

# Setup logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger("AICounsellor")

load_dotenv()

class AICounsellorError(Exception):
    """Base exception for AI Counsellor"""
    pass

class AIConfigurationError(AICounsellorError):
    """Raised when AI is not configured correctly"""
    pass

class AIGenerationError(AICounsellorError):
    """Raised when AI fails to generate a response"""
    pass

class AICounsellor:
    def __init__(self):
        self.use_mock = False
        try:
            api_key = os.getenv("GEMINI_API_KEY")
            # If no key is found, or it's a placeholder, we enter 'Mock Mode'
            # This ensures no requests are 'counted' or sent to the Gemini servers.
            if not api_key or "your-gemini-api-key" in api_key or len(api_key) < 10:
                logger.warning("GEMINI_API_KEY is missing or invalid. System starting in Mock Mode (No Quota Usage).")
                self.use_mock = True
                self.model = None
            else:
                genai.configure(api_key=api_key)
                self.model_name = 'gemini-flash-latest'
                self.model = genai.GenerativeModel(self.model_name)
                logger.info(f"AICounsellor initialized with model: {self.model_name}")
        except Exception as e:
            logger.error(f"Critical error during AI initialization: {str(e)}. Falling back to Mock Mode.")
            self.use_mock = True
            self.model = None

    def _generate_mock_response(self, message: str, user: User, profile: UserProfile) -> Dict:
        """
        Generates a local, rule-based response without contacting the Gemini API.
        Used when the API key is missing or quota is exceeded.
        """
        logger.info("Generating local mock response (Quota-Safe).")
        
        # Simple local logic to simulate intelligence
        if "mit" in message.lower() or "harvard" in message.lower() or "stanford" in message.lower():
            response_text = f"Hello {user.full_name}! These are top-tier schools. Given your GPA of {profile.gpa or 'N/A'}, you should focus on your SAT/IELTS scores to be competitive. I've added a task for you to check their specific requirements."
            actions = [{"action": "CREATE_TASK", "params": {"title": "Check Elite University Requirements", "priority": 4}}]
        elif "india" in message.lower():
            response_text = f"I see you're interested in India, {user.full_name}. For B.Tech in Computer Science, your priority should be the JEE Mains and Advanced exams. I'll move your stage to 'Researching Entrance Exams'."
            actions = [{"action": "UPDATE_STAGE", "params": {"stage": "preparing_applications"}}]
        else:
            response_text = f"I'm currently in Quota-Saving mode. To get a full AI response, please ensure a valid Gemini API Key is configured in the .env file. Based on your profile, I recommend looking at universities in {profile.preferred_countries or 'your target countries'}."
            actions = []

        return {
            "message": response_text + "\n\n(Note: This is a system-generated fallback response as no valid API key was used for this request.)",
            "actions": actions,
            "success": True,
            "is_mock": True
        }

    def get_user_context(self, user: User, profile: UserProfile, db: Session) -> str:
        """Build comprehensive user context for AI"""
        try:
            # Get shortlisted universities
            shortlisted = db.query(ShortlistedUniversity).filter(
                ShortlistedUniversity.user_id == user.id
            ).all()
            
            locked_unis = [s for s in shortlisted if s.is_locked]
            
            context = f"""
USER PROFILE:
Name: {user.full_name}
Email: {user.email}
Current Stage: {user.current_stage.value}
Onboarding Completed: {user.onboarding_completed}

ACADEMIC BACKGROUND:
- Education Level: {profile.education_level}
- Degree: {profile.degree}
- Major: {profile.major}
- Graduation Year: {profile.graduation_year}
- GPA: {profile.gpa if profile.gpa else 'Not provided'}

STUDY GOALS:
- Intended Degree: {profile.intended_degree}
- Field of Study: {profile.field_of_study}
- Target Intake: {profile.target_intake_year}
- Preferred Countries: {profile.preferred_countries}

BUDGET:
- Budget Range: ${profile.budget_min:,.0f} - ${profile.budget_max:,.0f} per year
- Funding Plan: {profile.funding_plan}

EXAM SCORES:
- IELTS: {profile.ielts_score if profile.ielts_score else 'Not taken'}
- TOEFL: {profile.toefl_score if profile.toefl_score else 'Not taken'}
- GRE: {profile.gre_score if profile.gre_score else 'Not taken'}
- GMAT: {profile.gmat_score if profile.gmat_score else 'Not taken'}
- SOP Status: {profile.sop_status}

PROFILE STRENGTH:
- Academic: {profile.academic_strength.value}
- Exams: {profile.exam_strength.value}
- SOP: {profile.sop_strength.value}

SHORTLISTED UNIVERSITIES: {len(shortlisted)}
LOCKED UNIVERSITIES: {len(locked_unis)}

TOP 10 UNIVERSITY MATCHES (AVAILABLE FOR ACTIONS):
{self._get_top_matches_context(profile, db)}
"""
            return context
        except Exception as e:
            logger.error(f"Error building user context: {str(e)}")
            return "User context could not be built due to an internal error."

    def _get_top_matches_context(self, profile: UserProfile, db: Session) -> str:
        """Get summarized list of top 10 matches for AI context"""
        try:
            universities = db.query(University).all()
            recs = self.recommend_universities(profile, universities)[:10]
            
            lines = []
            for r in recs:
                u = r['university']
                lines.append(f"- ID: {u.id} | {u.name} ({u.country}) | Fit: {r['fit_score']}% | Cat: {r['category']}")
            
            return "\n".join(lines)
        except Exception as e:
            logger.error(f"Error getting top matches context: {str(e)}")
            return "No university matches available."
    
    def get_system_prompt(self) -> str:
        """Get the system prompt that defines AI Counsellor behavior"""
        return """You are an AI Counsellor for study-abroad students.

CRITICAL INSTRUCTION: KEEP RESPONSES CONCISE AND MINIMAL.
- Do NOT provide long explanations unless asked.
- Avoid repeating user information.
- Use bullet points for clarity.
- Focus on the most important action or advice.
- Max response length: 2-3 short paragraphs or a list of 3-4 items.

Your role is to:
1. GUIDE DECISIONS - Actively guide students.
2. ANALYZE PROFILE - Assess strengths/gaps briefly.
3. RECOMMEND UNIVERSITIES - Suggest distinct options.
4. TAKE ACTIONS - Shortlist, create tasks, or lock choices.

ACTIONS SYNTAX (Invisible to user):
ACTION: [action_name]
PARAMS: {json_params}

AVAILABLE ACTIONS:
- SHORTLIST_UNIVERSITY
- CREATE_TASK
- LOCK_UNIVERSITY
- UPDATE_STAGE

Be helpful but extremely efficient and concise."""
    
    async def chat(
        self,
        message: str,
        user: User,
        profile: UserProfile,
        chat_history: List[Dict],
        db: Session
    ) -> Dict:
        """Process chat message and return response with potential actions"""
        
        # Check if we should use Mock Mode (No Key scenario)
        if self.use_mock or not self.model:
            return self._generate_mock_response(message, user, profile)

        try:
            # Build context
            user_context = self.get_user_context(user, profile, db)
            system_prompt = self.get_system_prompt()
            
            # Build conversation history
            conversation = f"{system_prompt}\n\n{user_context}\n\nCONVERSATION HISTORY:\n"
            for msg in chat_history[-10:]:  # Last 10 messages for context
                conversation += f"{msg['role'].upper()}: {msg['content']}\n"
            
            conversation += f"USER: {message}\nASSISTANT:"
            
            # Generate response with advanced error handling for Quota/Network
            try:
                response = self.model.generate_content(conversation)
                if not response or not response.text:
                    raise AIGenerationError("Empty response from AI")
                
                ai_message = response.text
                
                # Parse for actions (this has its own internal error handling)
                actions = self._parse_actions(ai_message)
                
                # Clean message (remove action syntax)
                clean_message = self._clean_message(ai_message)
                
                return {
                    "message": clean_message,
                    "actions": actions,
                    "success": True,
                    "is_mock": False
                }
            except Exception as api_err:
                # If the API call fails (e.g. Quota Exceeded), downgrade to Mock for THIS request
                logger.error(f"Gemini API call failed: {str(api_err)}. Switching to safe fallback.")
                return self._generate_mock_response(message, user, profile)
                
        except Exception as e:
            logger.error(f"Unexpected error in AI Chat flow: {str(e)}")
            return self._generate_mock_response(message, user, profile)
    
    def _parse_actions(self, message: str) -> List[Dict]:
        """Parse action commands from AI response"""
        actions = []
        try:
            lines = message.split('\n')
            
            i = 0
            while i < len(lines):
                line = lines[i].strip()
                if line.startswith('ACTION:'):
                    action_name = line.replace('ACTION:', '').strip()
                    params = {}
                    
                    if i + 1 < len(lines) and lines[i + 1].strip().startswith('PARAMS:'):
                        try:
                            params_str = lines[i + 1].replace('PARAMS:', '').strip()
                            params = json.loads(params_str)
                            # Increment i to skip the PARAMS line we just processed
                            i += 1
                        except json.JSONDecodeError as e:
                            logger.warning(f"Failed to parse action params: {params_str}. Error: {e}")
                    
                    actions.append({
                        "action": action_name,
                        "params": params
                    })
                i += 1
        except Exception as e:
            logger.error(f"Error parsing actions: {str(e)}")
        
        return actions
    
    def _clean_message(self, message: str) -> str:
        """Remove action syntax from message"""
        try:
            lines = message.split('\n')
            clean_lines = []
            
            i = 0
            while i < len(lines):
                line = lines[i].strip()
                if line.startswith('ACTION:'):
                    # Check if next line is PARAMS
                    if i + 1 < len(lines) and lines[i + 1].strip().startswith('PARAMS:'):
                        i += 2
                    else:
                        i += 1
                else:
                    clean_lines.append(lines[i])
                    i += 1
            
            return '\n'.join(clean_lines).strip()
        except Exception as e:
            logger.error(f"Error cleaning message: {str(e)}")
            return message # Return original if cleaning fails
    
    def analyze_profile(self, profile: UserProfile) -> Dict:
        """Analyze profile strength and provide recommendations"""
        try:
            # Academic strength
            academic_score = 0
            if profile.gpa:
                if profile.gpa >= 3.5:
                    academic_score = 3
                elif profile.gpa >= 3.0:
                    academic_score = 2
                else:
                    academic_score = 1
            
            # Exam strength
            exam_score = 0
            if profile.ielts_score and profile.ielts_score >= 7.0:
                exam_score += 1
            if profile.toefl_score and profile.toefl_score >= 100:
                exam_score += 1
            if profile.gre_score and profile.gre_score >= 320:
                exam_score += 1
            if profile.gmat_score and profile.gmat_score >= 700:
                exam_score += 1
            
            # SOP strength
            sop_score = 0
            if profile.sop_status == "Ready":
                sop_score = 3
            elif profile.sop_status == "Draft":
                sop_score = 2
            else:
                sop_score = 1
            
            return {
                "academic_score": academic_score,
                "exam_score": exam_score,
                "sop_score": sop_score,
                "overall_readiness": (academic_score + exam_score + sop_score) / 9 * 100
            }
        except Exception as e:
            logger.error(f"Error analyzing profile: {str(e)}")
            return {"error": "Profile analysis failed"}
    
    def recommend_universities(
        self,
        profile: UserProfile,
        universities: List[University]
    ) -> List[Dict]:
        """Recommend universities based on profile"""
        try:
            recommendations = []
            
            for uni in universities:
                # Calculate fit score
                fit_score = self._calculate_fit_score(profile, uni)
                
                # Determine category
                if fit_score >= 80:
                    category = "safe"
                elif fit_score >= 60:
                    category = "target"
                else:
                    category = "dream"
                
                # Determine risk level
                if fit_score >= 75:
                    risk = "Low"
                elif fit_score >= 50:
                    risk = "Medium"
                else:
                    risk = "High"
                
                recommendations.append({
                    "university": uni,
                    "fit_score": fit_score,
                    "category": category,
                    "risk_level": risk,
                    "reasoning": self._generate_reasoning(profile, uni, fit_score)
                })
            
            return sorted(recommendations, key=lambda x: x['fit_score'], reverse=True)
        except Exception as e:
            logger.error(f"Error recommending universities: {str(e)}")
            return []
    
    def _calculate_fit_score(self, profile: UserProfile, uni: University) -> float:
        """Calculate how well a university fits the student's profile"""
        try:
            score = 50  # Base score
            
            # GPA match
            if profile.gpa is not None and uni.min_gpa is not None:
                if profile.gpa >= uni.min_gpa + 0.5:
                    score += 20
                elif profile.gpa >= uni.min_gpa:
                    score += 10
                else:
                    score -= 20
            
            # IELTS match
            if profile.ielts_score is not None and uni.min_ielts is not None:
                if profile.ielts_score >= uni.min_ielts + 0.5:
                    score += 15
                elif profile.ielts_score >= uni.min_ielts:
                    score += 7
                else:
                    score -= 15
            
            # Budget match
            total_cost = (uni.tuition_fee_max or 0) + (uni.living_cost_yearly or 0)
            if profile.budget_max and total_cost > 0:
                if total_cost <= profile.budget_max:
                    score += 15
                elif total_cost <= profile.budget_max * 1.2:
                    score += 5
                else:
                    score -= 20
            
            # Ensure score is between 0 and 100
            return max(0.0, min(100.0, float(score)))
        except Exception as e:
            logger.error(f"Error calculating fit score: {str(e)}")
            return 50.0
    
    def _generate_reasoning(self, profile: UserProfile, uni: University, fit_score: float) -> str:
        """Generate reasoning for university recommendation"""
        try:
            reasons = []
            
            if profile.gpa is not None and uni.min_gpa is not None:
                if profile.gpa >= uni.min_gpa:
                    reasons.append(f"Your GPA ({profile.gpa}) meets or exceeds the requirement ({uni.min_gpa})")
                else:
                    reasons.append(f"Your GPA ({profile.gpa}) is below the target requirement ({uni.min_gpa})")
            
            total_cost = (uni.tuition_fee_max or 0) + (uni.living_cost_yearly or 0)
            if profile.budget_max and total_cost > 0:
                if total_cost <= profile.budget_max:
                    reasons.append(f"The estimated cost (${total_cost:,.0f}) is within your budget")
                else:
                    reasons.append(f"The estimated cost (${total_cost:,.0f}) exceeds your current budget range")
            
            if fit_score >= 70:
                reasons.append("This university represents a strong match for your academic and financial profile")
            elif fit_score >= 50:
                reasons.append("This is a balanced option that fits several of your criteria")
            else:
                reasons.append("This is considered a 'reach' school for your current profile")
            
            return ". ".join(reasons)
        except Exception as e:
            logger.error(f"Error generating reasoning: {str(e)}")
            return "Recommendation based on general profile match."

# Global instance
try:
    ai_counsellor = AICounsellor()
except Exception as e:
    logger.critical(f"Global AICounsellor instance failed to create: {e}")
    ai_counsellor = None
