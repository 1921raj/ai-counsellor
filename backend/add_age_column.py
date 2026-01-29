import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

def add_age_column():
    try:
        # Connect to default postgres database
        conn = psycopg2.connect(
            dbname='ai_counsellor',
            user='postgres',
            password='3214',
            host='localhost'
        )
        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cursor = conn.cursor()
        
        # Check if column exists
        cursor.execute("SELECT column_name FROM information_schema.columns WHERE table_name='user_profiles' AND column_name='age'")
        exists = cursor.fetchone()
        
        if not exists:
            cursor.execute('ALTER TABLE user_profiles ADD COLUMN age INTEGER')
            print("Column 'age' added to 'user_profiles' table successfully!")
        else:
            print("Column 'age' already exists in 'user_profiles' table.")
            
        cursor.close()
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    add_age_column()
