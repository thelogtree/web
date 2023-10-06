# Frontend/Web App

## Development Setup

1. clone the repo
2. `yarn`
3. Make a .env file in the project's root and fill in the following env variables with your own:
```
REACT_APP_API_KEY=""
REACT_APP_AUTH_DOMAIN=""
REACT_APP_PROJECT_ID=""
REACT_APP_STORAGE_BUCKET=""
REACT_APP_MESSENGER_ID="="
REACT_APP_ID=""
REACT_APP_MEASUREMENT_ID=""
REACT_APP_SEGMENT_WRITE_KEY="fill_in_if_you_want_to_track_your_company_usage"
REACT_APP_PROD_API_URL="url_you_are_hosting_the_server_on"
SKIP_PREFLIGHT_CHECK=true
```
5. `yarn start`

## Deployment

It should be relatively easy to figure out how to deploy this React app on Netlify or Vercel. I've already included files to make it easy for Netlify hosting.

## License

Logtree by Andy Lebowitz is licensed under Attribution-NonCommercial 4.0 International 
