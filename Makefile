.PHONY: install dev build preview audit lint format audit clean purge

help:
	@echo "Available commands:"
	@echo "  make install           - Install dependencies"
	@echo "  make dev               - Start development server"
	@echo "  make build             - Build for production"
	@echo "  make preview           - Preview production build"
	@echo "  make audit             - Check for outdated dependencies"
	@echo "  make lint              - Run linter"
	@echo "  make format            - Format code"
	@echo "  make clean             - Clean build artefacts"

install:
	@echo "Installing dependencies with Bun..."
	@bun install

dev:
	@echo "Starting development server..."
	@bun run dev

build:
	@echo "Building for production..."
	@bun run build

preview:
	@echo "Starting preview server..."
	@bun run preview

audit:
	@if [ ! -f "bun.lockb" ]; then \
		echo "No lockfile found. Installing dependencies first..."; \
		bun install; \
	fi
	@echo "Checking for outdated dependencies..."
	@if bun outdated | grep -qi "latest"; then \
		echo; \
		echo "To update dependencies, run: bun update --latest"; \
	else \
		echo "No outdated dependencies found"; \
	fi
	@echo
	@echo "Running audit..."
	@bun run audit

lint:
	@echo "Running linting..."
	@bun run lint
	@echo "For auto-fixing issues, run: bun run lint:fix"

format:
	@echo "Formatting code..."
	@bun run format

clean:
	@echo "Cleaning build artefacts..."
	rm -rf build/
	rm -rf .svelte-kit/
	rm -rf node_modules/.vite/

purge:
	@echo "Purging all dependencies and build artefacts..."
	rm -rf build/
	rm -rf .svelte-kit/
	rm -rf node_modules/
	rm -f bun.lock
