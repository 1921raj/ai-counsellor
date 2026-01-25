import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

def create_database():
    try:
        # Connect to default postgres database
        conn = psycopg2.connect(
            dbname='postgres',
            user='postgres',
            password='3214',
            host='localhost'
        )
        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cursor = conn.cursor()
        
        # Check if database exists
        cursor.execute("SELECT 1 FROM pg_database WHERE datname='ai_counsellor'")
        exists = cursor.fetchone()
        
        if not exists:
            cursor.execute('CREATE DATABASE ai_counsellor')
            print("Database 'ai_counsellor' created successfully!")
        else:
            print("Database 'ai_counsellor' already exists.")
            
        cursor.close()
        conn.close()
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    create_database()
