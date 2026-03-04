#!/bin/bash

# Mission Control Dashboard v2 - Launch Script
# Usage: ./launch.sh [dev|build|start]

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_header() {
    echo ""
    echo -e "${BLUE}╔══════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${BLUE}║          Mission Control Dashboard v2.0                      ║${NC}"
    echo -e "${BLUE}║          Virtus Wealth Advisors                              ║${NC}"
    echo -e "${BLUE}╚══════════════════════════════════════════════════════════════╝${NC}"
    echo ""
}

print_usage() {
    echo "Usage: ./launch.sh [command]"
    echo ""
    echo "Commands:"
    echo "  dev       Start development server with hot reload (client + server)"
    echo "  build     Build production bundle"
    echo "  start     Start production server"
    echo "  preview   Preview production build locally"
    echo "  clean     Clean build artifacts"
    echo ""
    echo "Examples:"
    echo "  ./launch.sh dev      # Start development mode"
    echo "  ./launch.sh build    # Build for production"
    echo "  ./launch.sh start    # Run production server"
}

check_dependencies() {
    if ! command -v node &> /dev/null; then
        echo -e "${RED}Error: Node.js is not installed${NC}"
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        echo -e "${RED}Error: npm is not installed${NC}"
        exit 1
    fi
    
    # Check if node_modules exists
    if [ ! -d "node_modules" ]; then
        echo -e "${YELLOW}Installing dependencies...${NC}"
        npm install
    fi
}

cmd_dev() {
    print_header
    check_dependencies
    echo -e "${GREEN}Starting development server...${NC}"
    echo -e "${BLUE}Dashboard will be available at: http://localhost:3001${NC}"
    echo -e "${BLUE}API server will be available at: http://localhost:3000${NC}"
    echo ""
    npm run dev
}

cmd_build() {
    print_header
    check_dependencies
    echo -e "${GREEN}Building production bundle...${NC}"
    npm run build
    echo ""
    echo -e "${GREEN}✓ Build complete!${NC}"
    echo -e "${BLUE}Output directory: dist/${NC}"
}

cmd_start() {
    print_header
    check_dependencies
    
    # Check if dist exists, if not build first
    if [ ! -d "dist" ] || [ ! -f "dist/index.html" ]; then
        echo -e "${YELLOW}Build not found. Building first...${NC}"
        npm run build
    fi
    
    echo -e "${GREEN}Starting production server...${NC}"
    echo -e "${BLUE}Dashboard will be available at: http://localhost:3000${NC}"
    echo ""
    npm start
}

cmd_preview() {
    print_header
    check_dependencies
    
    # Check if dist exists
    if [ ! -d "dist" ] || [ ! -f "dist/index.html" ]; then
        echo -e "${YELLOW}Build not found. Building first...${NC}"
        npm run build
    fi
    
    echo -e "${GREEN}Previewing production build...${NC}"
    echo -e "${BLUE}Dashboard will be available at: http://localhost:4173${NC}"
    echo ""
    npm run preview
}

cmd_clean() {
    echo -e "${YELLOW}Cleaning build artifacts...${NC}"
    rm -rf dist
    rm -rf node_modules
    echo -e "${GREEN}✓ Clean complete!${NC}"
}

# Main command dispatcher
case "${1:-}" in
    dev)
        cmd_dev
        ;;
    build)
        cmd_build
        ;;
    start)
        cmd_start
        ;;
    preview)
        cmd_preview
        ;;
    clean)
        cmd_clean
        ;;
    help|--help|-h)
        print_header
        print_usage
        ;;
    "")
        print_header
        echo -e "${YELLOW}No command specified.${NC}"
        print_usage
        ;;
    *)
        print_header
        echo -e "${RED}Unknown command: $1${NC}"
        print_usage
        exit 1
        ;;
esac
