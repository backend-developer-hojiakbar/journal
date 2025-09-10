#!/usr/bin/env python3
"""
Django migration script to add file size validation to existing models.
This script helps apply the file size validation changes to your Django project.

Usage:
1. Copy the validator functions to your models.py
2. Run: python manage.py makemigrations
3. Run: python manage.py migrate

File size limits:
- Images: 10MB maximum
- Files: 100MB maximum
"""

# Validator functions that should be added to your models.py
VALIDATOR_CODE = """
from django.core.exceptions import ValidationError

def validate_image_size(value):
    \"\"\"Validate that image file size is not more than 10MB\"\"\"
    limit = 10 * 1024 * 1024  # 10MB
    if value.size > limit:
        raise ValidationError(f'Fayl hajmi {limit / (1024 * 1024):.0f} MB dan oshmasligi kerak. Sizning faylingiz {value.size / (1024 * 1024):.2f} MB.')

def validate_file_size(value):
    \"\"\"Validate that file size is not more than 100MB\"\"\"
    limit = 100 * 1024 * 1024  # 100MB
    if value.size > limit:
        raise ValidationError(f'Fayl hajmi {limit / (1024 * 1024):.0f} MB dan oshmasligi kerak. Sizning faylingiz {value.size / (1024 * 1024):.2f} MB.')
"""

# Fields that have been updated with validators:
UPDATED_FIELDS = {
    'ContactMessageFile.file': 'validate_file_size (100MB limit)',
    'News.image': 'validate_image_size (10MB limit)',
    'Issue.cover_image': 'validate_image_size (10MB limit)',
    'Issue.pdf_file': 'validate_file_size (100MB limit)',
    'Article.article_file': 'validate_file_size (100MB limit)'
}

print("File size validation has been added to the following fields:")
for field, validation in UPDATED_FIELDS.items():
    print(f"  • {field}: {validation}")

print("\nTo apply these changes to your Django project:")
print("1. Ensure the validator functions are in your models.py")
print("2. Run: python manage.py makemigrations")
print("3. Run: python manage.py migrate")
print("\nNote: These validators will only affect new file uploads.")
print("Existing files that exceed the limits will not be automatically removed.")