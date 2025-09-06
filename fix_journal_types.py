# Complete Fix Script for Journal Types
# Run this in Django shell: python manage.py shell

print("=== Fixing Journal Types for Current Issues ===")

from your_app.models import Issue, Journal

# Step 1: Ensure journals exist
print("\n1. Creating/Verifying Journals...")
qx_journal, created = Journal.objects.get_or_create(
    short_name="QX",
    defaults={'name': "O'zbekiston qishloq va suv xo'jaligi"}
)
if created:
    print(f"✅ Created QX journal: {qx_journal.name}")
else:
    print(f"✅ QX journal exists: {qx_journal.name}")

ai_journal, created = Journal.objects.get_or_create(
    short_name="AI", 
    defaults={'name': "Agro ilm"}
)
if created:
    print(f"✅ Created AI journal: {ai_journal.name}")
else:
    print(f"✅ AI journal exists: {ai_journal.name}")

# Step 2: Fix existing issues without journal_type
print("\n2. Updating existing issues...")
issues_updated = 0
for issue in Issue.objects.all():
    updated = False
    
    # Set journal_type if missing
    if not issue.journal_type and issue.journal:
        issue.journal_type = issue.journal.short_name
        updated = True
        print(f"✅ Set journal_type for issue {issue.id}: {issue.title} -> {issue.journal_type}")
    
    # Fix journal assignment if needed
    if issue.journal_type == 'QX' and issue.journal != qx_journal:
        issue.journal = qx_journal
        updated = True
        print(f"✅ Fixed journal for QX issue {issue.id}: {issue.title}")
    elif issue.journal_type == 'AI' and issue.journal != ai_journal:
        issue.journal = ai_journal
        updated = True
        print(f"✅ Fixed journal for AI issue {issue.id}: {issue.title}")
    
    if updated:
        issue.save()
        issues_updated += 1

print(f"\n📊 Updated {issues_updated} issues")

# Step 3: Verify current issues
print("\n3. Current Issues Status:")
qx_current = Issue.objects.filter(journal_type='QX', is_current=True).first()
ai_current = Issue.objects.filter(journal_type='AI', is_current=True).first()

print(f"QX Current Issue: {qx_current.title if qx_current else 'None'}")
print(f"AI Current Issue: {ai_current.title if ai_current else 'None'}")

# Step 4: Fix multiple current issues if they exist
print("\n4. Checking for multiple current issues...")
qx_current_count = Issue.objects.filter(journal_type='QX', is_current=True).count()
ai_current_count = Issue.objects.filter(journal_type='AI', is_current=True).count()

if qx_current_count > 1:
    print(f"⚠️  Found {qx_current_count} current QX issues. Fixing...")
    qx_issues = Issue.objects.filter(journal_type='QX', is_current=True).order_by('-published_date')
    # Keep the latest, remove current status from others
    for issue in qx_issues[1:]:
        issue.is_current = False
        issue.save()
        print(f"✅ Removed current status from: {issue.title}")

if ai_current_count > 1:
    print(f"⚠️  Found {ai_current_count} current AI issues. Fixing...")
    ai_issues = Issue.objects.filter(journal_type='AI', is_current=True).order_by('-published_date')
    # Keep the latest, remove current status from others  
    for issue in ai_issues[1:]:
        issue.is_current = False
        issue.save()
        print(f"✅ Removed current status from: {issue.title}")

# Step 5: Final verification
print("\n5. Final Verification:")
print("="*50)

all_issues = Issue.objects.all()
qx_issues = all_issues.filter(journal_type='QX')
ai_issues = all_issues.filter(journal_type='AI')

print(f"Total Issues: {all_issues.count()}")
print(f"QX Issues: {qx_issues.count()}")
print(f"AI Issues: {ai_issues.count()}")

qx_current_final = qx_issues.filter(is_current=True).first()
ai_current_final = ai_issues.filter(is_current=True).first()

print(f"\n📌 Current QX Issue: {qx_current_final.title if qx_current_final else 'None'}")
print(f"📌 Current AI Issue: {ai_current_final.title if ai_current_final else 'None'}")

print("\n🎉 Fix completed! Now test these API endpoints:")
print("• GET /api/issues/?journal=qx&current=true")
print("• GET /api/issues/?journal=ai&current=true")
print("• GET /api/issues/ (should show all issues with journal_type)")

# Step 6: Test API-like queries
print("\n6. Testing API Queries:")
qx_current_api = Issue.objects.filter(journal_type__iexact='qx', is_current=True)
ai_current_api = Issue.objects.filter(journal_type__iexact='ai', is_current=True)

print(f"QX Current API Query Result: {qx_current_api.count()} issues")
if qx_current_api.exists():
    issue = qx_current_api.first()
    print(f"  - {issue.title} (journal_type: {issue.journal_type})")

print(f"AI Current API Query Result: {ai_current_api.count()} issues")  
if ai_current_api.exists():
    issue = ai_current_api.first()
    print(f"  - {issue.title} (journal_type: {issue.journal_type})")

print("\n✅ All fixes applied successfully!")