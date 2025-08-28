# Ollama Chat Interface

A simple and clean web interface for interacting with Ollama directly via HTTP API. This application provides a modern chat interface with model selection, internationalization support, comprehensive testing, and Docker support.

## Features

- 🚀 **Modern Chat Interface**: Clean, responsive design with markdown support
- 🔄 **Model Selection**: Dynamic model selector showing all available Ollama models
- 🌍 **Internationalization**: Support for Portuguese and English (easily extensible to other languages)
- 📱 **Responsive Design**: Works seamlessly on desktop and mobile devices
- ⚡ **Real-time Status**: Connection status indicator for Ollama
- 🧹 **Session Management**: Clear chat functionality and message history
- ⌨️ **Keyboard Shortcuts**: Enter to send, Shift+Enter for new lines
- 🎯 **Error Handling**: Graceful handling of connection issues and errors
- 🧪 **Comprehensive Testing**: Unit tests, integration tests, and E2E tests with Playwright
- 🐳 **Docker Ready**: Full Docker support with docker-compose

## Tech Stack

### Frontend
- React 18 with TypeScript
- React i18next for internationalization
- Axios for API communication
- React Markdown for message rendering
- CSS Modules for styling

### Backend
- Node.js with Express
- TypeScript
- Direct HTTP API integration with Ollama
- CORS enabled for development
- Environment variable configuration

### Testing
- **Frontend**: Jest with React Testing Library
- **Backend**: Jest with Supertest for API testing
- **E2E**: Playwright for cross-browser testing
- **Coverage**: 80%+ code coverage requirement

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Ollama running locally on `localhost:11434`

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ollm
   ```

2. **Install all dependencies**
   ```bash
   npm run install:all
   ```

3. **Configure environment variables**
   
   Copy the example environment file in the backend:
   ```bash
   cp backend/.env.example backend/.env
   ```
   
   Edit `backend/.env` to match your Ollama configuration:
   ```env
   PORT=5002
   OLLAMA_BASE_URL=http://localhost:11434
   DEFAULT_MODEL=llama2
   ```

## Development

> **Note**: Development uses ports 5000 (frontend) and 5002 (backend) to avoid conflicts with other projects. Docker uses the traditional ports 3000 and 3002.

### Quick Start (Recommended)
Run both frontend and backend simultaneously:
```bash
npm run dev
```

This will start:
- Frontend on `http://localhost:5000`
- Backend on `http://localhost:5002`

### Individual Services

**Frontend only:**
```bash
npm run dev:frontend
```

**Backend only:**
```bash
npm run dev:backend
```

## Testing

This project includes comprehensive testing at all levels:

### Running Tests

**All tests (recommended):**
```bash
npm run quality  # Runs type-check, lint, and all tests
```

**Individual test suites:**
```bash
# Unit tests only
npm test

# Frontend tests with coverage
npm run test:frontend

# Backend tests
npm run test:backend

# End-to-end tests
npm run test:e2e

# E2E tests with UI (for debugging)
npm run test:e2e:ui
```

### Test Structure

- **Frontend Tests**: Located in `frontend/src/**/__tests__/` and `*.test.tsx` files
- **Backend Tests**: Located in `backend/src/**/__tests__/` and `*.test.ts` files  
- **E2E Tests**: Located in `e2e/` directory

### Code Quality

```bash
# Run linting
npm run lint

# Fix linting issues
npm run lint:fix

# TypeScript type checking
npm run type-check
```

## Production

### Build
```bash
npm run build
```

### Start Production Server
```bash
npm start
```

## Configuration

### Backend Configuration
Environment variables in `backend/.env`:

- `PORT` - Backend server port (default: 5002 for development)
- `OLLAMA_BASE_URL` - Ollama server URL (default: http://localhost:11434)
- `DEFAULT_MODEL` - Default model to use (default: llama2)

### Frontend Configuration
Create `frontend/.env` for frontend-specific variables:

```env
REACT_APP_API_URL=http://localhost:5002/api
```

## Using with Ollama

1. **Install Ollama** following the instructions at [ollama.ai](https://ollama.ai)

2. **Pull some models** (examples):
   ```bash
   ollama pull llama2
   ollama pull mistral
   ollama pull codellama
   ```

3. **Verify Ollama is running**:
   ```bash
   curl http://localhost:11434/api/tags
   ```

4. **Start the chat interface** and select your preferred model from the dropdown.

## Internationalization

The application supports multiple languages through react-i18next:

- **English** (default)
- **Portuguese** 

### Adding New Languages

1. Create a new translation file in `frontend/src/i18n/locales/[language_code].json`
2. Copy the structure from `en.json` and translate the values
3. Update `frontend/src/i18n/index.ts` to include the new language
4. Modify the `LanguageSwitcher` component to include the new language option

See `frontend/src/i18n/README_TRANSLATORS.md` for detailed instructions.

## Project Structure

```
ollm/
├── frontend/           # React TypeScript application
│   ├── src/
│   │   ├── components/ # React components
│   │   ├── services/   # API services
│   │   ├── types/      # TypeScript types
│   │   └── i18n/       # Internationalization
├── backend/            # Node.js Express server
│   ├── src/
│   │   └── index.ts    # Main server file
│   └── .env            # Environment variables
├── package.json        # Root package.json with scripts
└── README.md
```

## API Endpoints

- `GET /api/health` - Check Ollama connection status
- `GET /api/models` - List available Ollama models
- `POST /api/chat` - Send message to Ollama model

## Docker Support

This project includes full Docker support for easy deployment.

> **Note**: Docker uses standard ports 3000 (frontend) and 3002 (backend), different from development ports to maintain consistency with production deployments.

### Using Docker

**Build the Docker image:**
```bash
docker build -t ollm .
```

**Run the container:**
```bash
docker run -d -p 3000:3000 -p 3002:3002 \
  -e OLLAMA_BASE_URL=http://host.docker.internal:11434 \
  --name ollm \
  ollm
```

### Using Docker Compose (Recommended)

**Start the application (assumes Ollama is running locally):**
```bash
docker-compose up -d
```

This will start:
- Frontend on `http://localhost:3000`
- Backend on `http://localhost:3002`
- Connects to local Ollama on `http://localhost:11434`

**To run without the Ollama container** (if you have Ollama running locally):
```bash
# Edit docker-compose.yml and remove the 'depends_on: - ollama' line
docker-compose up -d ollm-chat
```

### Docker Operations & Management

**Rebuild Docker images** (after code changes):
```bash
# Rebuild with no cache to ensure fresh build
docker-compose build --no-cache

# Then restart containers
docker-compose up -d
```

**View container status:**
```bash
docker-compose ps
```

**View logs:**
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f ollm-chat

# Last 50 lines
docker-compose logs --tail=50 ollm-chat
```

**Stop services:**
```bash
# Stop all services
docker-compose down

# Stop and remove volumes
docker-compose down -v
```

**Clean up Docker resources:**
```bash
# Remove stopped containers, unused networks, images, and build cache
docker system prune -a

# Remove only unused Docker images
docker image prune -a
```

**Access container shell:**
```bash
docker-compose exec ollm-chat /bin/sh
```

**Update after code changes:**
```bash
# Full rebuild and restart process
docker-compose down
docker-compose build --no-cache  
docker-compose up -d
```

### Configuration for Docker

The Docker setup includes these environment variables:
- `OLLAMA_BASE_URL` - Points to Ollama server (uses `host.docker.internal` for local Ollama)
- `NODE_ENV=production` - Runs in production mode
- `PORT=3002` - Backend port (Docker environment)

## Development Operations & Maintenance

### Useful Commands for Daily Development

**Quick Development Setup:**
```bash
# Install dependencies and start development
npm run install:all
npm run dev
```

**Code Quality Checks:**
```bash
# Run full quality check (recommended before commits)
npm run quality

# Individual checks
npm run lint                 # Check code style
npm run lint:fix            # Fix auto-fixable issues
npm run type-check          # TypeScript type validation
```

**Testing Commands:**
```bash
# Run all tests with coverage
npm test

# Individual test suites
npm run test:frontend       # Frontend unit tests
npm run test:backend        # Backend unit tests  
npm run test:e2e           # End-to-end tests
npm run test:e2e:ui        # E2E with visual interface
```

**Build Operations:**
```bash
# Build for production
npm run build

# Build individual components
npm run build:frontend     # Frontend only
npm run build:backend      # Backend only
```

**Process Management:**
```bash
# Check what's running on ports (Development)
lsof -i :5000              # Check frontend port
lsof -i :5002              # Check backend port
lsof -i :11434             # Check Ollama port

# Kill processes on ports (Development)
npx kill-port 5000         # Kill frontend
npx kill-port 5002         # Kill backend
```

**Dependency Management:**
```bash
# Update all dependencies
npm run install:all

# Check for outdated packages
npm outdated               # Root
cd frontend && npm outdated # Frontend
cd backend && npm outdated  # Backend

# Clean install (when dependencies are corrupted)
rm -rf node_modules frontend/node_modules backend/node_modules
rm package-lock.json frontend/package-lock.json backend/package-lock.json
npm run install:all
```

**Git Operations:**
```bash
# Check status before commits
git status
npm run quality            # Ensure tests pass
git add .
git commit -m "Your message"

# Push changes and update Docker
git push
docker-compose build --no-cache
docker-compose up -d
```

**Log Monitoring:**
```bash
# Development logs
npm run dev                # Shows both frontend and backend logs

# Docker logs
docker-compose logs -f     # Follow all container logs
docker-compose logs -f ollm-chat  # Follow specific service

# Ollama logs (if running locally)
ollama logs                # If available
journalctl -u ollama       # On systemd systems
```

**Performance & Debugging:**
```bash
# Bundle analysis (frontend)
cd frontend && npm run build
npx webpack-bundle-analyzer build/static/js/*.js

# Memory usage
docker stats              # Docker container resources
top -p $(pgrep node)      # Node.js processes

# Network debugging
curl -v http://localhost:5002/api/models  # Test backend API (Development)
curl -v http://localhost:3002/api/models  # Test backend API (Docker)
curl -v http://localhost:11434/api/tags   # Test Ollama connection
```

**Backup & Recovery:**
```bash
# Export Docker images
docker save ollm-ollm-chat > ollm-backup.tar

# Import Docker images
docker load < ollm-backup.tar

# Backup configuration
tar -czf ollm-config-backup.tar.gz backend/.env frontend/.env docker-compose.yml
```

## Troubleshooting

### Common Issues

1. **Ollama not connecting**
   - Ensure Ollama is running: `ollama serve`
   - Check Ollama is accessible: `curl http://localhost:11434/api/tags`
   - Verify `OLLAMA_BASE_URL` in backend `.env`

2. **No models available**
   - Pull models: `ollama pull llama2`
   - Restart the backend after pulling new models

3. **CORS errors**
   - Ensure backend is running on correct port (5002 for development, 3002 for Docker)
   - Check `REACT_APP_API_URL` in frontend configuration

4. **Build errors**
   - Clear node_modules and reinstall: `rm -rf node_modules && npm install`
   - Ensure Node.js version is 16 or higher

5. **Docker showing old version** (after code changes)
   - Rebuild Docker images: `docker-compose build --no-cache`
   - Restart containers: `docker-compose up -d`
   - Verify logs: `docker-compose logs -f ollm-chat`

6. **Port conflicts**
   - **Development**: Check `lsof -i :5000` and `lsof -i :5002`
   - **Docker**: Check `lsof -i :3000` and `lsof -i :3002`
   - Kill conflicting processes: `npx kill-port [port]`
   - Or change ports in configuration files

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Ollama](https://ollama.ai) - Local LLM runtime
- [React](https://reactjs.org/) - Frontend framework  
- [Express](https://expressjs.com/) - Backend framework
- [Playwright](https://playwright.dev/) - End-to-end testing framework