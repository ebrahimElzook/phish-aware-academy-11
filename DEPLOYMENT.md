# Deploying Phish Aware Academy to Render

This guide explains how to deploy the Phish Aware Academy application to Render.com for testing purposes.

## Prerequisites

- A Render account (sign up at [render.com](https://render.com) if you don't have one)
- Your code pushed to a Git repository (GitHub, GitLab, etc.)

## Deployment Steps

### 1. Deploy the Backend

1. Log in to your Render dashboard
2. Click "New" and select "Blueprint" from the dropdown
3. Connect your Git repository
4. Select the repository containing your application
5. Render will detect the `render.yaml` file in your backend directory
6. Follow the prompts to complete the setup
7. Render will automatically create a PostgreSQL database based on your configuration

### 2. Run Database Migrations

After the backend is deployed:

1. In the Render dashboard, go to your backend service
2. Click on "Shell"
3. Run the following commands:
   ```
   python manage.py migrate
   python manage.py collectstatic --noinput
   ```

### 3. Deploy the Frontend

1. After the backend is deployed, deploy the frontend using the same process
2. Connect your repository
3. Render will detect the `render.yaml` file in your root directory
4. Follow the prompts to complete the setup

### 4. Environment Variables

The following environment variables are automatically set up in the `render.yaml` files:

**Backend:**
- `SECRET_KEY`: Generated automatically by Render
- `DEBUG`: Set to False for production
- `ALLOWED_HOSTS`: Set to .onrender.com
- `FRONTEND_URL`: Set to your frontend URL on Render
- `BACKEND_URL`: Set to your backend URL on Render
- `DATABASE_URL`: Connection string to your PostgreSQL database

**Frontend:**
- `VITE_API_URL`: Set to your backend URL on Render

### 5. Testing Your Deployment

Once deployed, your application will be accessible at:
- Frontend: https://phish-aware-academy-frontend.onrender.com
- Backend: https://phish-aware-academy-backend.onrender.com

## Troubleshooting

If you encounter any issues:

1. Check the logs in the Render dashboard
2. Ensure all environment variables are properly set
3. Verify that the database migrations ran successfully
4. Check that the frontend is correctly configured to connect to the backend

## Local Development

For local development:
- Backend: Run `python manage.py runserver`
- Frontend: Run `npm run dev`

The application will use the local environment variables from `.env.development` for local development.
