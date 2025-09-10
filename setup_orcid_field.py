#!/usr/bin/env python3
"""
Script to add ORCID ID field to Author model in existing Django database.
Run this script in your Django project environment.
"""

import django
import os
import sys

# Setup Django environment
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'your_project.settings')
django.setup()

from django.db import connection
from django.core.management import execute_from_command_line

def add_orcid_field():
    """Add ORCID ID field to Author table if it doesn't exist"""
    
    with connection.cursor() as cursor:
        # Check if orcid_id column already exists
        cursor.execute("""
            SELECT COUNT(*) 
            FROM information_schema.columns 
            WHERE table_name='your_app_author' 
            AND column_name='orcid_id'
        """)
        
        if cursor.fetchone()[0] == 0:
            print("Adding orcid_id field to Author table...")
            
            # Add the column
            cursor.execute("""
                ALTER TABLE your_app_author 
                ADD COLUMN orcid_id VARCHAR(25) DEFAULT '' NOT NULL
            """)
            
            # Make it nullable after adding
            cursor.execute("""
                ALTER TABLE your_app_author 
                ALTER COLUMN orcid_id DROP NOT NULL
            """)
            
            print("✅ ORCID ID field added successfully!")
        else:
            print("✅ ORCID ID field already exists!")

def main():
    print("🔧 Setting up ORCID ID field for Author model...")
    print("="*50)
    
    try:
        add_orcid_field()
        print("\n🎉 Database update completed successfully!")
        print("\nNext steps:")
        print("1. Update your Django models.py with the ORCID field")
        print("2. Run: python manage.py makemigrations")
        print("3. Run: python manage.py migrate")
        print("4. Restart your Django server")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        print("\nPlease check your database connection and table names.")
        print("You may need to adjust table names in this script.")

if __name__ == "__main__":
    main()