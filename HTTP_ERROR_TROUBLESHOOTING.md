# Angular HTTP Error Troubleshooting Guide

## 🚨 "Http failure response for http://localhost:8080/api/employees: 0 Unknown Error"

This error typically indicates that the HTTP request failed before reaching the server or receiving a response.

## 🔍 Common Causes and Solutions

### 1. **CORS Issues** ✅ SOLVED

- **Problem**: Cross-Origin Resource Sharing not configured
- **Solution**: Added CorsConfig.java with proper CORS settings
- **Check**: Browser DevTools > Network tab > Look for CORS preflight OPTIONS requests

### 2. **Backend Server Not Running**

- **Problem**: Spring Boot server is not started or crashed
- **Check**:
  ```bash
  cd c:\ERP_learningmap\YF_test_back
  mvn spring-boot:run
  ```
- **Verify**: Open http://localhost:8080/actuator/health in browser

### 3. **API Endpoint URL Mismatch** ✅ SOLVED

- **Problem**: Frontend calling wrong endpoint URL
- **Before**: Frontend calls `/api/employees`, Backend serves `/api/v1/employees`
- **Solution**: Updated backend controller to use `/api/employees`

### 4. **Network/Firewall Issues**

- **Problem**: Local firewall blocking requests
- **Check**:
  ```bash
  netstat -ano | findstr :8080
  telnet localhost 8080
  ```
- **Solution**:
  - Disable Windows Firewall temporarily
  - Add firewall exception for Java/Spring Boot

### 5. **Port Conflicts**

- **Problem**: Another service using port 8080
- **Check**: `netstat -ano | findstr :8080`
- **Solution**:
  ```bash
  # Kill conflicting process
  taskkill /F /PID <process_id>
  # Or change Spring Boot port in application.properties
  server.port=8081
  ```

### 6. **SSL/HTTPS Issues**

- **Problem**: Mixed content (HTTPS → HTTP) or SSL certificate issues
- **Solution**: Use HTTP for development, ensure proxy config has `"secure": false`

### 7. **Angular Proxy Issues**

- **Problem**: Proxy not working or misconfigured
- **Check**: Start Angular with: `ng serve --proxy-config proxy.conf.json`
- **Debug**: Check proxy logs in terminal

### 8. **Database Connection Issues**

- **Problem**: Backend starts but can't connect to database
- **Check**: Backend logs for database connection errors
- **Solution**: Verify MySQL is running and connection string is correct

### 9. **Request Timeout**

- **Problem**: Request takes too long and times out
- **Solution**: Increase timeout in Angular HttpClient:
  ```typescript
  this.http.get(url, { timeout: 30000 });
  ```

### 10. **Authentication/Security Issues**

- **Problem**: Security filters blocking requests
- **Check**: Spring Security configuration
- **Solution**: Add permitAll() for API endpoints during development

## 🧪 Testing Steps (When API works in Postman but not Angular)

### Step 1: Compare Request Headers

```bash
# In Postman, check:
# - Headers tab
# - Authorization
# - Content-Type

# In Angular DevTools:
# - Network tab
# - Check request headers
# - Look for missing headers
```

### Step 2: Test Direct URL Access

```bash
# Test in browser directly:
http://localhost:8080/api/employees

# Should return JSON response or CORS error
```

### Step 3: Check Angular HTTP Interceptors

```typescript
// Look for interceptors that might be modifying requests
// Check for authentication tokens, custom headers
```

### Step 4: Enable Detailed Logging

```typescript
// In Angular service, add logging:
this.http.get(url).pipe(
  tap((response) => console.log("Success:", response)),
  catchError((error) => {
    console.error("Detailed error:", error);
    return throwError(error);
  })
);
```

### Step 5: Use Angular Proxy for Development

```json
// proxy.conf.json
{
  "/api/*": {
    "target": "http://localhost:8080",
    "secure": false,
    "changeOrigin": true,
    "logLevel": "debug"
  }
}
```

```bash
# Start with proxy
ng serve --proxy-config proxy.conf.json --port 4201
```

## 🔧 Emergency Solutions

### Quick Fix 1: Disable CORS in Browser (Development Only)

```bash
# Chrome with disabled security (DANGEROUS - Dev only)
chrome.exe --user-data-dir="C:\temp\chrome_dev" --disable-web-security --disable-features=VizDisplayCompositor
```

### Quick Fix 2: Use HttpClient with No-CORS Mode

```typescript
// Add to your service (temporary fix)
const httpOptions = {
  headers: new HttpHeaders({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  }),
};
```

### Quick Fix 3: Backend Temporary CORS Allow All

```java
// In controller (temporary)
@CrossOrigin(origins = "*")
@RestController
public class EmployeeController {
    // ...
}
```

## 📊 Verification Checklist

- [ ] Backend server running on http://localhost:8080
- [ ] Database connected successfully
- [ ] API endpoint accessible via browser/Postman
- [ ] CORS configuration in place
- [ ] Frontend proxy configuration correct
- [ ] No firewall blocking connections
- [ ] Correct API URLs in frontend service
- [ ] Angular dev server started with proxy config

## 🆘 Last Resort Debug Steps

1. **Use Browser DevTools**:

   - Network tab → Check failed requests
   - Console tab → Look for CORS errors
   - Security tab → Check mixed content issues

2. **Check Backend Logs**:

   - Look for incoming requests in Spring Boot logs
   - Check for exceptions or errors

3. **Test with cURL**:

   ```bash
   curl -X GET http://localhost:8080/api/employees -H "Origin: http://localhost:4201" -v
   ```

4. **Temporary Network Test**:
   ```bash
   # Test if backend is reachable
   ping localhost
   telnet localhost 8080
   ```
