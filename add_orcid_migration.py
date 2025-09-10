# Django Migration Script for adding ORCID ID field to Author model
# Run this in your Django project's migration directory

from django.db import migrations, models

class Migration(migrations.Migration):

    dependencies = [
        # Update this to match your last migration
        ('your_app_name', '0001_initial'),
    ]

    operations = [
        migrations.AddField(
            model_name='author',
            name='orcid_id',
            field=models.CharField(
                blank=True, 
                help_text='Masalan: 0000-0002-1495-3967', 
                max_length=25, 
                verbose_name='ORCID ID'
            ),
        ),
    ]