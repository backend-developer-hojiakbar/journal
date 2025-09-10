# Server Configuration for File Upload Size Limits

## Problem Description
You're getting a "413 Request Entity Too Large" error when uploading a 4MB image. This happens because your web server (Nginx/Apache) has a default upload size limit that's smaller than your file.

## Solution Steps

### 1. Nginx Configuration (Most Common)

If you're using Nginx, you need to increase the upload size limit:

#### Option A: Edit the main Nginx configuration
```bash
# Edit the Nginx configuration file
sudo nano /etc/nginx/nginx.conf

# Or edit your site-specific configuration
sudo nano /etc/nginx/sites-available/your-site
```

Add this line inside the `server` block:
```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    # Increase upload size limit to 50MB
    client_max_body_size 50M;
    
    # Your other configuration...
    location / {
        proxy_pass http://your-backend;
        # ... other proxy settings
    }
}
```

#### Option B: Add to your location block
```nginx
location /api/ {
    client_max_body_size 50M;
    proxy_pass http://your-backend;
    # ... other settings
}
```

### 2. Apache Configuration

If you're using Apache, add these directives:

```apache
# In your .htaccess file or Apache configuration
LimitRequestBody 52428800  # 50MB in bytes

# Alternative in httpd.conf or virtual host
<Directory "/path/to/your/app">
    LimitRequestBody 52428800
</Directory>
```

### 3. Django Settings

Make sure your Django `settings.py` also allows large uploads:

```python
# Maximum size, in bytes, of a request
DATA_UPLOAD_MAX_MEMORY_SIZE = 52428800  # 50MB

# Maximum size of the entire request  
FILE_UPLOAD_MAX_MEMORY_SIZE = 52428800  # 50MB

# Maximum number of files that can be uploaded
DATA_UPLOAD_MAX_NUMBER_FIELDS = 1000
```

### 4. Apply Changes

After making configuration changes:

#### For Nginx:
```bash
# Test the configuration
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
# or
sudo service nginx reload
```

#### For Apache:
```bash
# Test the configuration
sudo apache2ctl configtest

# Restart Apache
sudo systemctl restart apache2
# or
sudo service apache2 restart
```

## Quick Fix for Development

If you're running a development server and want a quick fix, you can temporarily reduce your image file size:

1. Compress your 4MB image to under 1MB using online tools
2. Or resize the image dimensions to reduce file size

## Verification

After applying the server configuration:

1. Try uploading your 4MB image again
2. Check the browser's Developer Tools > Network tab for any errors
3. If you still get 413 errors, the upload limit might need to be increased further

## Common Upload Size Limits

- **Default Nginx**: 1MB (`client_max_body_size 1m`)
- **Default Apache**: 2GB (but often limited by other factors)
- **Recommended for your app**: 50MB (allows up to 50MB files)

## File Size Recommendations

- **News images**: 1-5MB (good quality, reasonable load time)
- **Issue covers**: 2-8MB (high quality needed)
- **PDF articles**: 5-50MB (depends on content and length)

## Testing Commands

You can test your server's upload limit using curl:

```bash
# Create a test file of specific size (5MB)
dd if=/dev/zero of=test_5mb.txt bs=1M count=5

# Test upload to your API
curl -X POST -F "image=@test_5mb.txt" https://api.qxjurnal.uz/api/news/
```

If this returns a 413 error, your server configuration needs to be updated.

## Contact Your Server Administrator

If you don't have access to server configuration files, contact your hosting provider or system administrator with this information:

> "Please increase the client_max_body_size (Nginx) or LimitRequestBody (Apache) to 50MB for file uploads on our domain. We're getting 413 Request Entity Too Large errors when uploading files larger than the current limit."

The exact location of configuration files may vary depending on your hosting setup.