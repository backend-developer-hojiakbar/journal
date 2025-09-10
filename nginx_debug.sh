#!/bin/bash

# Nginx Upload Configuration Troubleshooting Script
# This script helps diagnose and fix 413 Request Entity Too Large errors

echo "=== Nginx Upload Configuration Troubleshooting ==="
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    echo "⚠️  Note: Some commands may require sudo privileges"
    echo ""
fi

echo "1. Testing Nginx configuration..."
nginx -t 2>&1
if [ $? -eq 0 ]; then
    echo "✅ Nginx configuration is valid"
else
    echo "❌ Nginx configuration has errors - please fix them first"
    exit 1
fi
echo ""

echo "2. Checking current client_max_body_size settings..."
nginx -T 2>/dev/null | grep -i client_max_body_size | head -5
echo ""

echo "3. Checking if your domain configuration is loaded..."
nginx -T 2>/dev/null | grep -A 10 -B 2 "api.qxjurnal.uz"
echo ""

echo "4. Testing Nginx process status..."
systemctl status nginx --no-pager -l
echo ""

echo "5. Checking Nginx error logs for recent issues..."
echo "Recent error log entries:"
tail -10 /var/log/nginx/error.log 2>/dev/null || echo "Could not read error log (may need sudo)"
echo ""

echo "6. Testing file upload with curl..."
echo "Creating a 5MB test file..."
dd if=/dev/zero of=/tmp/test_5mb.txt bs=1M count=5 2>/dev/null

echo "Testing upload to your API..."
response=$(curl -s -o /dev/null -w "%{http_code}" -X POST -F "test=@/tmp/test_5mb.txt" http://api.qxjurnal.uz/api/news/ 2>/dev/null)
echo "HTTP Response Code: $response"

if [ "$response" = "413" ]; then
    echo "❌ Still getting 413 error - configuration not applied"
elif [ "$response" = "000" ]; then
    echo "❌ Could not connect to server"
else
    echo "✅ No 413 error (got $response instead)"
fi

# Clean up
rm -f /tmp/test_5mb.txt
echo ""

echo "=== RECOMMENDED ACTIONS ==="
echo ""

if [ "$response" = "413" ]; then
    echo "🔧 The 413 error persists. Try these steps:"
    echo ""
    echo "1. Restart Nginx completely:"
    echo "   sudo systemctl restart nginx"
    echo ""
    echo "2. Check if you have multiple Nginx configuration files:"
    echo "   sudo find /etc/nginx -name \"*.conf\" -exec grep -l \"api.qxjurnal.uz\" {} \\;"
    echo ""
    echo "3. Verify the correct configuration file is being used:"
    echo "   sudo nginx -T | grep -B 5 -A 5 \"api.qxjurnal.uz\""
    echo ""
    echo "4. Make sure client_max_body_size is in the correct location:"
    echo "   It should be inside the server block for api.qxjurnal.uz"
    echo ""
    echo "5. Try adding it to the http block as well:"
    echo "   Add 'client_max_body_size 50M;' to /etc/nginx/nginx.conf in the http section"
    echo ""
    echo "6. Check for any proxy_pass configurations that might override settings"
    echo ""
else
    echo "✅ Configuration appears to be working!"
    echo ""
    echo "If you're still getting 413 errors in the browser:"
    echo "1. Clear browser cache and try again"
    echo "2. Try a different browser or incognito mode"
    echo "3. Check browser developer tools for exact error details"
    echo "4. Verify the frontend is sending requests to the correct domain"
fi

echo ""
echo "=== NGINX CONFIGURATION TEMPLATE ==="
echo ""
echo "Here's the correct configuration for your server block:"
echo ""
cat << 'EOF'
server {
    listen 80;
    server_name api.qxjurnal.uz;
    
    # Increase upload size limit
    client_max_body_size 50M;
    client_body_timeout 300s;
    client_header_timeout 300s;
    
    # Your other configuration...
    location / {
        # Add these if you're using a proxy
        proxy_pass http://your_backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # Also set proxy timeouts for large uploads
        proxy_connect_timeout 300s;
        proxy_send_timeout 300s;
        proxy_read_timeout 300s;
    }
}
EOF

echo ""
echo "=== ALTERNATIVE DEBUGGING COMMANDS ==="
echo ""
echo "If the issue persists, run these commands manually:"
echo ""
echo "# Check all Nginx configuration files"
echo "sudo find /etc/nginx -type f -name '*.conf' | xargs grep -l client_max_body_size"
echo ""
echo "# Check if there are conflicting configurations"
echo "sudo nginx -T | grep client_max_body_size"
echo ""
echo "# Monitor Nginx error log in real-time"
echo "sudo tail -f /var/log/nginx/error.log"
echo ""
echo "# Test with a small file first"
echo "curl -X POST -F 'test=@/etc/passwd' http://api.qxjurnal.uz/api/news/"
echo ""

echo "=== END OF TROUBLESHOOTING ==="