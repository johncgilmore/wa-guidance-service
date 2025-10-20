# Security Policy

## Reporting a Vulnerability

If you discover a security vulnerability in this project, please report it responsibly:

1. **DO NOT** open a public GitHub issue
2. Email security concerns to: [your-email@cstreettax.com]
3. Include:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

We will respond within 48 hours and work with you to address the issue.

## Security Considerations

### API Keys
- Never commit OpenAI API keys to version control
- Always use environment variables (`OPENAI_API_KEY`)
- Ensure your `.env` files are in `.gitignore`

### Input Validation
This service validates all inputs before processing. However:
- Always sanitize user inputs on your application layer
- Rate-limit API endpoints to prevent abuse
- Monitor OpenAI API usage for unexpected spikes

### Dependencies
- We use `openai` as the only production dependency
- Run `npm audit` regularly to check for vulnerabilities
- Keep dependencies updated

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

## Best Practices

1. Keep your OpenAI API key secret and rotate it if exposed
2. Use environment-specific API keys (dev, staging, prod)
3. Monitor your OpenAI usage and set billing limits
4. Implement rate limiting in your application
5. Log errors but never log sensitive data

