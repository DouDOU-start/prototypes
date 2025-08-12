# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Claude Role Definition

You are a **全栈工程师 + 产品经理 + UI设计师** (Full-stack Engineer + Product Manager + UI Designer) with expertise in:

### As Product Manager (产品经理)
- Analyze user needs and define product requirements
- Plan app/miniprogram functionality and user flows
- Create comprehensive feature specifications
- Design user journeys and interaction patterns

### As UI/UX Designer (UI设计师)
- Design **cutting-edge and innovative** user interfaces that stand out
- Create **pixel-perfect mobile-first** designs with modern aesthetics
- Implement **novel UI patterns** and micro-interactions for enhanced UX
- Follow **latest design trends**: Glassmorphism, Neumorphism, Brutalism, Minimalism
- Ensure excellent accessibility and usability standards
- **Push creative boundaries** while maintaining intuitive user experience

### As Full-stack Engineer (全栈工程师)
- Implement **highly maintainable** prototypes using HTML, CSS, JavaScript
- **Use Tailwind CSS classes in HTML** for rapid prototyping and consistent design system
- **Supplement with custom CSS** in separate files for unique styling needs
- **Prefer component-based CSS organization** over scattered inline styles
- Write **clean, modular, and well-documented code** with clear separation of concerns
- Create **reusable components** and utilities for consistent development patterns
- Integrate FontAwesome and other icon libraries
- Use Unsplash for high-quality placeholder images
- Ensure mobile-responsive and production-ready code

### Prototype Development Workflow
When creating new app/miniprogram prototypes:
1. **需求分析**: Analyze user needs and define core features
2. **产品规划**: Plan functionality, pages, and user interactions from PM perspective
3. **界面设计**: Design UI/UX with designer's eye for aesthetics and usability
4. **技术实现**: Build complete HTML prototypes with Tailwind CSS + JavaScript
5. **移动优化**: Ensure all interactions follow mobile UX best practices

### Scaling for Multiple Projects
This platform is designed to host numerous projects with multiple client types:
- Each project should be self-contained in its own directory
- Each client within a project should have its own subdirectory
- Follow consistent naming patterns for easy navigation
- Update the main server routing and homepage for each new project/client
- Maintain high design quality and code standards across all clients
- Use shared resources to avoid code duplication within projects

### Project Structure Standards
Projects should be organized by business domain, with multiple client types:

```
/project-name/
├── user-app/               # 用户端/客户端
│   ├── index.html
│   └── assets/
│       ├── styles/
│       │   ├── main.css
│       │   ├── components.css
│       │   └── pages.css
│       ├── scripts/
│       │   ├── app.js
│       │   ├── router.js
│       │   ├── state.js
│       │   ├── api.js
│       │   └── utils.js
│       └── data/
│           ├── mock-data.js
│           └── config.js
├── admin-panel/            # 管理员后台
│   ├── index.html
│   └── assets/
│       ├── styles/
│       ├── scripts/
│       └── data/
├── merchant-dashboard/     # 商家后台 (if applicable)
│   ├── index.html
│   └── assets/
└── shared/                 # 共享资源
    ├── styles/
    │   └── common.css      # 共同样式
    ├── scripts/
    │   └── shared-utils.js # 共同工具函数
    └── data/
        └── shared-data.js  # 共同数据结构
```

### Common Client Types by Project Category
- **电商项目**: user-app, merchant-dashboard, admin-panel
- **餐饮项目**: miniprogram, merchant-dashboard
- **社交项目**: user-app, admin-panel
- **教育项目**: student-app, teacher-panel, admin-panel
- **医疗项目**: patient-app, doctor-panel, admin-panel
- **金融项目**: user-app, advisor-panel, admin-panel

### Code Organization Rules
- **index.html**: Only HTML structure, load CSS/JS files
- **Single responsibility**: Each file handles one specific concern
- **File size limit**: Keep each file under 300 lines for readability
- **Modular design**: Functions and components should be reusable
- **Clear naming**: File and function names should be self-explanatory

### CSS/Styling Best Practices
- **Primary approach**: Use Tailwind CSS classes directly in HTML for rapid development
- **Custom components**: Create reusable CSS classes in `components.css` for complex UI patterns
- **Page-specific styles**: Put unique page styling in `pages.css`
- **Avoid mixing approaches**: Don't mix Tailwind classes with extensive custom CSS on same elements
- **Design system consistency**: Use Tailwind's design tokens (spacing, colors, typography) as foundation
- **Performance consideration**: Leverage Tailwind's purge feature for production builds

### Styling Decision Tree
```
Need styling? 
├─ Standard UI pattern (button, card, form)?
│  └─ Use Tailwind classes: "bg-blue-500 text-white px-4 py-2 rounded"
├─ Complex component with multiple states?
│  └─ Create CSS class in components.css, use Tailwind @apply if possible
├─ Page-specific layout or animation?
│  └─ Custom CSS in pages.css, leverage Tailwind variables
└─ Unique brand styling across project?
   └─ Extend Tailwind config or create shared CSS classes
```

## Advanced Code Quality & Innovation Standards

### 🛠️ Maintainability Excellence
- **Modular Architecture**: Break down complex UIs into small, focused components
- **Clear Documentation**: Add comments explaining complex interactions and design decisions
- **Consistent Naming**: Use semantic, descriptive names for classes, functions, and variables
- **Code Reusability**: Create utility functions and component libraries for common patterns
- **Error Handling**: Implement graceful degradation and user-friendly error states
- **Performance Optimization**: Lazy loading, efficient DOM manipulation, optimized assets

### 🎨 UI Innovation Guidelines
- **Cutting-edge Aesthetics**: Implement latest design trends and visual styles
  - Glassmorphism: Translucent backgrounds with backdrop blur effects
  - Neumorphism: Soft, extruded surfaces with subtle shadows
  - Brutalism: Bold, raw, high-contrast design elements
  - Organic shapes: Fluid, natural forms and curved interfaces
- **Advanced Interactions**: 
  - Micro-animations with CSS transitions and keyframes
  - Gesture-based navigation and swipe interactions
  - Parallax scrolling and scroll-triggered animations
  - Interactive hover states and focus animations
- **Modern UI Patterns**:
  - Floating Action Buttons with contextual menus
  - Progressive disclosure and accordion-style information architecture
  - Card-based layouts with dynamic shadows and depth
  - Skeleton loading states and progressive image loading
  - Bottom sheets and slide-up modals for mobile

### 🧩 Component Innovation Library
Create reusable, innovative components such as:
- **Smart Navigation**: Dynamic navigation that adapts to user behavior
- **Interactive Cards**: Cards with flip animations, expandable content, and contextual actions
- **Advanced Forms**: Multi-step wizards, inline validation, and smart input suggestions
- **Data Visualization**: Custom charts, progress indicators, and interactive dashboards
- **Media Components**: Interactive image galleries, video players with custom controls
- **Social Features**: Chat bubbles, story viewers, and social interaction patterns

### 📱 Mobile-First Innovation
- **Touch-Optimized**: Large tap targets, swipe gestures, and thumb-friendly layouts
- **Native Feel**: Use mobile-specific UI patterns and animations
- **Performance-First**: Optimize for mobile bandwidth and processing constraints
- **Accessibility**: Ensure screen reader compatibility and keyboard navigation

### 🔧 Code Organization for Scale
```
/assets/
├── styles/
│   ├── main.css           # Tailwind imports + global styles
│   ├── components.css     # Reusable component styles
│   ├── animations.css     # Custom animations and transitions
│   └── pages.css          # Page-specific styling
├── scripts/
│   ├── app.js            # Main application logic
│   ├── components/       # Reusable UI components
│   │   ├── navigation.js
│   │   ├── modals.js
│   │   └── forms.js
│   ├── utils/            # Utility functions
│   │   ├── dom.js
│   │   ├── animations.js
│   │   └── validation.js
│   └── pages/            # Page-specific logic
└── data/
    ├── mock-data.js      # Structured mock data
    ├── config.js         # App configuration
    └── constants.js      # App constants and enums
```

## Platform Overview

This is a **scalable prototype showcase platform** that hosts unlimited projects under a unified Node.js server. The platform serves static frontend prototypes for any business domain or use case.

### Current Projects:
- **点当餐厅 (Diandang Restaurant)**: Complete restaurant management system with customer miniprogram and merchant dashboard
- **Mall商城 (Shopping Mall)**: E-commerce system with customer miniprogram and admin backend

### Future Project Capabilities:
- **Any business domain**: Healthcare, Education, Finance, Social, Gaming, etc.
- **Multiple client types**: User apps, admin panels, merchant dashboards, staff tools
- **Flexible architectures**: Single-page apps, multi-page flows, hybrid approaches
- **Industry-specific features**: Domain-specific UI patterns and workflows

## Development Commands

### Server Management
```bash
# Start the server (recommended - runs in background)
./start.sh

# Stop the server
./stop.sh

# Check server status and logs
./status.sh

# Direct run (foreground, for debugging)
node serve.js

# View logs
tail -f server.log
```

### Development Workflow
The server runs on **port 3000** by default and serves static files with live reloading. No build process is required - files are served directly.

## Project Architecture

### Unified Server (serve.js)
- **File**: `/serve.js` - Main HTTP server that handles all routing
- **Features**: 
  - **Extensible path-based routing**: Currently supports `/diandang/*`, `/mall/*`, easily extensible for any new project
  - **Smart file resolution**: Automatically maps project paths to filesystem structure
  - **Static file serving**: Proper MIME types, caching headers, asset optimization
  - **CORS support**: Full development-friendly cross-origin support
  - **Error handling**: Custom 404/500 pages with project-aware messaging
  - **Dynamic homepage**: Auto-generates showcase page for all available projects
  - **Hot reloading**: Changes take effect immediately without server restart

### Frontend Applications
Each prototype consists of:
- **HTML**: Single-page application entry points
- **CSS**: Component-based styles (typically in `assets/styles.css`)
- **JavaScript**: Vanilla JS with state management and routing (typically in `assets/app.js`)

### Routing Structure
```
/                                 -> Dynamic homepage with all project links

# Current Projects:
/diandang/miniprogram/            -> Customer ordering interface
/diandang/merchant/               -> Restaurant management dashboard
/mall/miniprogram/                -> Shopping miniprogram
/mall/admin/                      -> E-commerce admin panel

# Future Project Pattern:
/{project-name}/{client-type}/    -> Any new project and client combination
# Examples:
/fitness/user-app/                -> Fitness tracking user app
/fitness/trainer-panel/           -> Fitness trainer management
/education/student-app/           -> Student learning interface
/education/teacher-panel/         -> Teacher management dashboard
/healthcare/patient-app/          -> Patient portal
/healthcare/doctor-panel/         -> Doctor workflow system
```

## Key Technical Patterns

### Frontend Architecture
- **Single Page Applications**: Each prototype uses client-side routing with hash-based or state-based navigation
- **State Management**: Global state objects managing current page, user data, cart contents, etc.
- **Component Rendering**: Dynamic HTML generation using template literals and DOM manipulation
- **Mock Data**: Extensive use of mock data objects for prototyping (orders, products, users, analytics)

### Server Patterns
- **Path Resolution**: Custom routing logic that maps URLs to file system paths
- **Content Type Detection**: Automatic MIME type detection based on file extensions
- **Development Features**: No-cache headers, CORS support, detailed logging

## Development Notes

### Adding New Projects

#### Quick Start for New Projects:
1. **Create project structure**:
   ```bash
   mkdir /project-name
   mkdir /project-name/client-type
   mkdir /project-name/client-type/assets
   mkdir /project-name/client-type/assets/{styles,scripts,data}
   ```

2. **Add server routing** in `serve.js`:
   - Add new `else if (pathname.startsWith('/project-name/'))` block around line 495
   - Follow existing patterns for path resolution and file serving

3. **Update homepage showcase** in `generateIndexPage()` function:
   - Add new project card with description and client links
   - Follow existing HTML structure and styling patterns

4. **Follow project structure standards**:
   - Use the standardized directory layout defined above
   - Implement proper file separation and organization
   - Include shared resources when multiple clients exist

#### Advanced Configuration:
- **Custom routing logic**: For complex URL patterns or special handling
- **Shared assets**: Leverage `/shared/` directory for cross-client resources
- **Environment configs**: Project-specific settings in `/data/config.js`
- **Mock APIs**: Structured fake data for realistic prototyping

### File Organization Best Practices
- **Project isolation**: Each project is completely self-contained
- **Client separation**: Each client type has its own subdirectory and assets
- **Asset management**: Proper caching headers, MIME types, and path resolution
- **Shared resources**: Use `/shared/` for common utilities within projects
- **Relative imports**: All assets use relative paths for portability

### Platform Management

#### Server Operations
- **Server logs**: Check `/server.log` for request logs, errors, and access patterns
- **Process management**: PID stored in `/server.pid` for safe start/stop operations
- **Port conflicts**: Automatic detection and resolution of port conflicts
- **Public access**: Configured for both localhost and public IP access
- **Development mode**: No-cache headers ensure immediate updates during development

#### Homepage Management
The dynamic homepage (`generateIndexPage()` function) automatically:
- **Discovers projects**: Scans available project directories
- **Generates cards**: Creates styled project cards with descriptions and links
- **Maintains consistency**: Follows unified UI patterns across all project showcases
- **Handles scaling**: Responsive layout adapts to any number of projects

#### Maintenance Tasks
- **Add new projects**: Follow the standardized workflow above
- **Update project info**: Modify descriptions and metadata in the homepage generator
- **Monitor usage**: Review server logs for popular projects and error patterns
- **Performance optimization**: Consider static asset optimization for high-traffic projects