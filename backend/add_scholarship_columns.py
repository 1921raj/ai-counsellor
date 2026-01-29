import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

def add_scholarship_columns():
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
        
        # Check if scholarship_available exists
        cursor.execute("SELECT column_name FROM information_schema.columns WHERE table_name='universities' AND column_name='scholarship_available'")
        exists_available = cursor.fetchone()
        
        if not exists_available:
            cursor.execute('ALTER TABLE universities ADD COLUMN scholarship_available BOOLEAN DEFAULT FALSE')
            print("Column 'scholarship_available' added successfully!")
            
        # Check if scholarship_details exists
        cursor.execute("SELECT column_name FROM information_schema.columns WHERE table_name='universities' AND column_name='scholarship_details'")
        exists_details = cursor.fetchone()
        
        if not exists_details:
            cursor.execute('ALTER TABLE universities ADD COLUMN scholarship_details TEXT')
            print("Column 'scholarship_details' added successfully!")
            
        if exists_available and exists_details:
             print("Columns already exist.")

        # Update existing records with some dummy scholarship data for demo
        # Set roughly half to have scholarships
        cursor.execute("UPDATE universities SET scholarship_available = TRUE, scholarship_details = 'Merit-based scholarships available covering up to 50% tuition.' WHERE id % 2 = 0")
        cursor.execute("UPDATE universities SET scholarship_available = TRUE, scholarship_details = 'Full-ride scholarships for top 5% applicants.' WHERE ranking <= 10")
        print("Updated existing universities with mock scholarship data.")

        cursor.close()
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    add_scholarship_columns()
