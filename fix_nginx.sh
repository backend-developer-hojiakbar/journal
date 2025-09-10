#!/bin/bash

echo "=== Nginx Configuration Fix Script ==="
echo ""

# Check current configuration
echo "1. Testing current Nginx configuration..."
sudo nginx -t
if [ $? -ne 0 ]; then
    echo "❌ Nginx configuration has errors! Please fix them first."
    exit 1
fi

echo "✅ Nginx configuration is valid"
echo ""

# Show current client_max_body_size settings
echo "2. Current client_max_body_size settings:"
sudo nginx -T 2>/dev/null | grep -i client_max_body_size
echo ""

# Check if api.qxjurnal.uz is configured
echo "3. Checking api.qxjurnal.uz configuration:"
sudo nginx -T 2>/dev/null | grep -B 5 -A 10 "api.qxjurnal.uz"
echo ""

# Stop Nginx completely
echo "4. Stopping Nginx..."
sudo systemctl stop nginx
sleep 2

# Start Nginx fresh
echo "5. Starting Nginx fresh..."
sudo systemctl start nginx
sleep 2

# Check status
echo "6. Checking Nginx status..."
sudo systemctl status nginx --no-pager -l
echo ""

# Test with a file upload
echo "7. Testing file upload (creating 3MB test file)..."
dd if=/dev/zero of=/tmp/test_3mb.txt bs=1M count=3 2>/dev/null

echo "8. Testing upload to your API..."
response=$(curl -s -o /dev/null -w "%{http_code}" -X POST -F "test=@/tmp/test_3mb.txt" http://api.qxjurnal.uz/api/news/ 2>/dev/null)
echo "HTTP Response Code: $response"

if [ "$response" = "413" ]; then
    echo "❌ Still getting 413 error!"
    echo ""
    echo "POSSIBLE SOLUTIONS:"
    echo "1. Check if you edited the correct configuration file"
    echo "2. Add the setting to /etc/nginx/nginx.conf in the http block"
    echo "3. Check for multiple server blocks with the same server_name"
    echo "4. Verify no load balancer is overriding the setting"
elif [ "$response" = "000" ]; then
    echo "❌ Could not connect to server (may be normal for a test endpoint)"
else
    echo "✅ No 413 error! (got HTTP $response instead)"
fi

# Clean up
rm -f /tmp/test_3mb.txt

echo ""
echo "=== RECOMMENDED ACTIONS ==="
echo ""
echo "If you're still getting 413 errors:"
echo ""
echo "1. Edit the MAIN nginx.conf file:"
echo "   sudo nano /etc/nginx/nginx.conf"
echo ""
echo "2. Add this line inside the 'http' block:"
echo "   client_max_body_size 50M;"
echo ""
echo "3. Your http block should look like:"
echo "   http {"
echo "       client_max_body_size 50M;"
echo "       # ... other settings"
echo "   }"
echo ""
echo "4. Then restart again:"
echo "   sudo systemctl restart nginx"
echo ""
echo "5. Find ALL config files that might contain your domain:"
echo "   sudo find /etc/nginx -type f -name '*.conf' | xargs grep -l 'qxjurnal'"
echo ""

echo "=== ALTERNATIVE DEBUGGING ==="
echo ""
echo "If the issue persists, run these commands:"
echo ""
echo "# Check all configuration files"
echo "sudo nginx -T | grep -A 20 -B 5 'server_name.*qxjurnal'"
echo ""
echo "# Check for includes that might override settings"
echo "sudo nginx -T | grep -i include"
echo ""
echo "# Monitor error log while testing"
echo "sudo tail -f /var/log/nginx/error.log"
echo ""

echo "Script completed!"