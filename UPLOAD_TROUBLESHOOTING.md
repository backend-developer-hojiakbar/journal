# Upload Troubleshooting Guide - 413 Request Entity Too Large

## Current Issue
You're still getting "413 Request Entity Too Large" errors even after configuring Nginx with `client_max_body_size 50M`.

## ✅ What You've Done Right
```nginx
server {
    listen 80;
    server_name api.qxjurnal.uz;
    
    # Fayl yuklash hajmini 50MB gacha oshirish
    client_max_body_size 50M;
    
    # ... (boshqa location bloklari)
}
```

## 🔧 Required Actions

### 1. **Restart Nginx Service**
```bash
# Test configuration first
sudo nginx -t

# If test passes, restart Nginx (CRITICAL STEP!)
sudo systemctl restart nginx

# Check status
sudo systemctl status nginx
```

### 2. **Verify Configuration is Active**
```bash
# Check if your setting is being applied
sudo nginx -T | grep client_max_body_size

# Should show: client_max_body_size 50M;
```

### 3. **Check for Multiple Configuration Files**
Sometimes the wrong config file is being used:
```bash
# Find all config files that mention your domain
sudo find /etc/nginx -name "*.conf" -exec grep -l "api.qxjurnal.uz" {} \;

# Check for conflicting settings
sudo nginx -T | grep -B 5 -A 5 "api.qxjurnal.uz"
```

### 4. **Add Global Setting (If Needed)**
Add to `/etc/nginx/nginx.conf` in the `http` block:
```nginx
http {
    # Global setting as fallback
    client_max_body_size 50M;
    
    # ... other settings
}
```

### 5. **Enhanced Server Configuration**
Update your server block with additional timeout settings:
```nginx
server {
    listen 80;
    server_name api.qxjurnal.uz;
    
    # File upload settings
    client_max_body_size 50M;
    client_body_timeout 300s;
    client_header_timeout 300s;
    
    # If using proxy_pass, add these too:
    location / {
        proxy_pass http://your_backend;
        proxy_connect_timeout 300s;
        proxy_send_timeout 300s;
        proxy_read_timeout 300s;
        proxy_request_buffering off;
    }
}
```

## 🧪 Frontend Testing

### Browser Console Testing
1. Open your admin page in the browser
2. Open Developer Tools (F12)
3. Go to Console tab
4. Run these test commands:

```javascript
// Test 1MB upload
window.uploadTester.quickTest.test1MB()

// Test 4MB upload  
window.uploadTester.quickTest.test4MB()

// Test 10MB upload
window.uploadTester.quickTest.test10MB()
```

### Manual Testing Steps
1. Try uploading a very small image (< 100KB) first
2. Then try progressively larger files:
   - 500KB image
   - 1MB image
   - 4MB image
   - 8MB image

## 🔍 Debugging Commands

### Check Nginx Error Logs
```bash
# Monitor errors in real-time
sudo tail -f /var/log/nginx/error.log

# Check recent errors
sudo tail -50 /var/log/nginx/error.log | grep -i "413\|entity\|too\|large"
```

### Test with Curl
```bash
# Create test file
dd if=/dev/zero of=test_4mb.txt bs=1M count=4

# Test upload
curl -X POST -F "test=@test_4mb.txt" http://api.qxjurnal.uz/api/news/ -v

# Check response code
curl -X POST -F "test=@test_4mb.txt" http://api.qxjurnal.uz/api/news/ -o /dev/null -s -w "%{http_code}\n"
```

## 🚨 Common Issues & Solutions

### Issue 1: Configuration Not Applied
**Symptom**: Still getting 413 errors
**Solution**: 
```bash
sudo systemctl restart nginx  # Full restart, not just reload
```

### Issue 2: Wrong Configuration File
**Symptom**: Changes don't take effect
**Solution**: 
```bash
# Find the correct config file
sudo nginx -T | grep -B 10 -A 10 "api.qxjurnal.uz"
```

### Issue 3: Proxy Server Override
**Symptom**: 413 error from upstream
**Solution**: Add settings to proxy location block:
```nginx
location / {
    proxy_pass http://backend;
    client_max_body_size 50M;  # Add this line
}
```

### Issue 4: Load Balancer/CDN Limits
**Symptom**: 413 error despite correct Nginx config
**Solution**: Check if you're using Cloudflare, AWS ALB, or other services that have their own upload limits.

## 🎯 Enhanced Frontend Features

### New Error Handling
The frontend now provides detailed error messages:
- **413 errors**: Clear instruction to check server config
- **Timeout errors**: Suggests network issues
- **File size validation**: Prevents oversized uploads
- **Progress indication**: Shows upload progress

### File Upload Improvements
- ✅ Real-time file size display
- ✅ Upload progress indicator  
- ✅ Better error messages
- ✅ Timeout handling for large files
- ✅ File type validation

## 📋 Quick Checklist

- [ ] Nginx configuration includes `client_max_body_size 50M`
- [ ] Nginx service restarted (not just reloaded)
- [ ] Configuration test passes: `sudo nginx -t`
- [ ] No conflicting configuration files
- [ ] Error logs checked for clues
- [ ] Browser cache cleared
- [ ] Test with small file first
- [ ] Test with curl command
- [ ] Check if using proxy/CDN with limits

## 🆘 If Nothing Works

1. **Check for hidden proxy servers**:
   ```bash
   curl -I http://api.qxjurnal.uz/api/news/
   # Look for Server headers that might indicate a proxy
   ```

2. **Try HTTPS if available**:
   ```bash
   curl -X POST -F "test=@test_file.txt" https://api.qxjurnal.uz/api/news/
   ```

3. **Contact your hosting provider** - they might have additional limits

4. **Check Django settings** in your backend:
   ```python
   # In settings.py
   DATA_UPLOAD_MAX_MEMORY_SIZE = 52428800  # 50MB
   FILE_UPLOAD_MAX_MEMORY_SIZE = 52428800  # 50MB
   ```

## 📞 Getting Help

If the issue persists, provide this information when asking for help:

1. Output of: `sudo nginx -T | grep -A 5 -B 5 client_max_body_size`
2. Output of: `curl -X POST -F "test=@small_file.txt" http://api.qxjurnal.uz/api/news/ -v`
3. Recent Nginx error logs
4. Your exact Nginx configuration file
5. Browser console errors when uploading

The issue should be resolved after following these steps systematically! 🚀