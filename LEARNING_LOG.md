# Haloweave Jobs Learning Log

## Day 1: Project Setup, Git Basics, and Next.js Introduction

1. GitHub Repository
   - Created a new repository on GitHub
   - Learned: A repository is a project folder that stores files and their revision history

2. Local Development Environment
   - Opened Visual Studio Code (VS Code)
   - Learned: VS Code is an Integrated Development Environment (IDE) for coding

3. Git Commands and Concepts
   - `git clone`: Copies a repository from GitHub to local machine
   - `cd`: Changes current directory
   - `git checkout -b`: Creates and switches to a new branch
   - Branches: Parallel versions of code for working on different features
   - Commits: Snapshots of code at specific points in time
   - Merge: Combining changes from one branch into another
   - Pull Requests: Proposing and reviewing changes before merging
   - Push/Pull: Sending to and receiving changes from remote repositories

4. Benefits of Git and Version Control
   - Track changes and revert if needed
   - Collaborate with others without conflicts
   - Improve code quality through peer review
   - Safely experiment with new ideas
   - Document project development through commit messages

5. Next.js Setup
   - Used `npx create-next-app@latest .` to initialize a Next.js project
   - Learned: Next.js is a React framework for building web applications
   - Encountered and resolved conflicts with existing files

6. Project Structure
   - Learned about key files and directories in a Next.js project:
     - `README.md`: Project information
     - `next-env.d.ts`: TypeScript declarations for Next.js
     - `app`: Directory for application code
     - `next.config.mjs`: Next.js configuration
     - `node_modules`: External dependencies
     - `package.json` and `package-lock.json`: Project metadata and dependency management
     - `tsconfig.json`: TypeScript configuration

7. Command Line
   - `ls`: Lists contents of a directory
   - Learned to interpret command prompt information (username, computer name, current directory)

Next Steps:
- Explore the `app` directory structure
- Learn about Next.js routing system
- Start building the landing page
- Practice Git workflow: creating branches, making commits, and merging changes

8. Git Branch Management
   - Learned: Changes are committed to the current working branch
   - `git push origin <branch-name>`: Pushes changes from local branch to the same branch on GitHub
   - Importance of being aware of which branch you're working on
   - Process of merging changes from a feature branch to the main branch:
     1. `git checkout main`: Switch to the main branch
     2. `git merge <feature-branch>`: Merge changes from feature branch
     3. `git push origin main`: Push merged changes to GitHub

Lesson Learned: Always verify the current working branch before committing and pushing changes. Use `git branch` to see all branches and the current active branch.

Next Steps:
- Practice proper Git workflow: creating branches, making commits, and merging changes
- Explore the `app` directory structure
- Learn about Next.js routing system
- Start building the landing page

9. Git and GitHub User Management
   - Checking Git user configuration:
     - `git config user.name`: Displays the name associated with your Git commits
     - `git config user.email`: Displays the email associated with your Git commits
   - Verifying GitHub authentication:
     - `ssh -T git@github.com`: Checks SSH authentication with GitHub
   - Checking repository permissions:
     - GitHub repository settings > Collaborators and teams
     - Roles: Owner, Collaborator, etc.
   - Verifying remote repository:
     - `git remote -v`: Displays the URLs of remote repositories

Lesson Learned: Proper configuration and authentication are crucial for smooth collaboration in Git and GitHub. Always ensure your local Git configuration matches your GitHub account, and that you have the necessary permissions for the repository you're working on.

Next Steps:
- Verify Git configuration and GitHub permissions
- Ensure correct remote repository is set
- Continue with exploring the Next.js project structure
- Begin building the landing page

10. Git Status and Branch Management
    - "Working tree clean" message:
      - Means all changes have been committed
      - No new changes to stage or commit
    - Understanding branches and project files:
      - Files created by `create-next-app` exist in the branch where the command was run
      - Switching branches doesn't add or remove these files, it changes which version you're working with
    - `git status`: Command to check the current state of your working directory and staging area

11. GitHub Repository Management
    - Added account as admin in repository settings
    - Learned: Repository settings are crucial for managing access and permissions

Lesson Learned: Regular use of `git status` helps understand the current state of your work. Branches are different versions of your project, not separate storage locations for files.

Next Steps:
- Review the existing files in your current branch
- Start modifying the Next.js files to create your landing page
- Practice using `git status` to monitor your changes

12. Git Troubleshooting: Pushing Changes
    - Issue: "Everything up-to-date" message when trying to push, but no visible changes in GitHub
    - Diagnosis steps:
      1. `git branch -a`: List all branches (local and remote)
      2. `git remote -v`: Verify remote repository URL
      3. `git status`: Check for unpushed commits
    - Solution:
      - Push to the current working branch, not main: `git push origin <current-branch-name>`
      - If needed, force push (use cautiously): `git push -f origin <current-branch-name>`
    - Learned: Importance of matching local branch name with remote branch when pushing

Lesson Learned: Always verify the branch you're pushing to. The local branch name should match the remote branch name in the push command.

Next Steps:
- Verify successful push by checking the correct branch on GitHub
- If issues persist, consider cloning the repository fresh and reapplying changes
- Start working on the landing page in the correct branch

13. Git Branching Strategy and Workflow
    - Successfully pushed changes to `feature/landing-page` branch
    - Understanding the purpose of the main branch:
      1. Primary/official branch of the project
      2. Default branch when cloning
      3. Often represents production-ready code
      4. Integration point for feature branches
      5. Base for creating release branches
    - Feature Branch Workflow:
      1. Create feature branch from main
      2. Develop feature in isolated branch
      3. Push feature branch to remote repository
      4. Create Pull Request for code review
      5. Merge feature branch into main after approval

Lesson Learned: Different branches serve different purposes in Git workflow. Feature branches allow for isolated development, while the main branch maintains a stable, production-ready version of the code.

Next Steps:
- Continue developing the landing page in the feature branch
- When ready, create a Pull Request to merge `feature/landing-page` into `main`
- Learn how to review and merge Pull Requests on GitHub

14. Advanced Git Branching Strategies
    - Creating branches for features and changes:
      - Ensures safe experimentation without affecting main codebase
      - Use descriptive names: `feature/add-login-form`, `bugfix/fix-header-layout`
    
    - Managing multiple branches:
      - Use clear, descriptive names
      - Regularly clean up merged or abandoned branches
    
    - Best practices for branch management:
      a. Consistent naming conventions (e.g., `feature/`, `bugfix/`, `hotfix/` prefixes)
      b. Single-purpose branches (one feature or change per branch)
      c. Regular merging or rebasing with main branch
      d. Use `git branch` to list and `git checkout` to switch branches
      e. Delete branches after merging
    
    - Tracking branches:
      - `git branch`: List local branches
      - `git branch -r`: List remote branches
      - `git branch -a`: List all branches (local and remote)
    
    - Handling small changes:
      - Use short-lived "topic branches" for tiny changes
      - Consider `git stash` for very small, temporary experiments
    
    - Git stash:
      - Temporarily save changes without creating a branch
      - Useful for quick tests or switching contexts

Lesson Learned: Effective branch management is key to organized development. It allows for safe experimentation, clear feature separation, and maintains a clean, understandable project history.

Next Steps:
- Practice creating and managing multiple feature branches
- Experiment with Git stash for small changes
- Implement a consistent branch naming convention for the project

15. Viewing and Deploying the Application
    
    a. Viewing Locally:
    - Run `npm run dev` in the project directory
    - Access the application at `http://localhost:3000`
    - Next.js hot reloading allows real-time updates
    
    b. Deploying to Vercel:
    - Install Vercel CLI: `npm install -g vercel`
    - Deploy command: `vercel`
    - First-time setup involves logging in and linking GitHub account
    - Vercel automatically detects Next.js and configures the build
    
    c. Continuous Deployment:
    - Push code to GitHub
    - Link GitHub repository to Vercel project
    - Automatic deployments on every push to the linked repository

Lesson Learned: The development workflow involves local development and testing, followed by deployment to a hosting platform. Vercel simplifies the deployment process for Next.js applications and provides continuous deployment capabilities.

Next Steps:
- Set up continuous deployment with Vercel
- Explore Vercel's environment variables for managing sensitive information
- Learn about preview deployments for pull requests

16. Git Workflow for Updating Repository

a. Staging Changes:
   - Command: `git add <file>` or `git add .` (for all changes)
   - Terminology: "Staging" or "Adding to the staging area"
   - Use `git status` to view staged and unstaged changes

b. Committing Changes:
   - Command: `git commit -m "Your commit message"`
   - Terminology: Creating a "commit" (snapshot of changes)

c. Pushing Changes:
   - Command: `git push origin <branch-name>`
   - Terminology: "Pushing" local commits to the remote repository

Best Practices:
1. Stage and commit related changes together
2. Write clear, descriptive commit messages
3. Push changes regularly to keep the remote up-to-date

Standard Workflow Example:
```bash
git status
git add .
git commit -m "Update landing page and add placeholder pages"
git push origin feature/landing-page
```

Lesson Learned: Regularly updating your repository with clear, well-organized commits is crucial for maintaining a clean project history and facilitating collaboration.

Next Steps:
- Practice the Git workflow with your recent changes
- Learn about creating pull requests for merging changes into the main branch
- Explore Git branching strategies for different features or experiments

17. Asset Management in Next.js

a. Using the `public` folder:
   - Create a `public` folder in the project root
   - Place global static assets here (images, favicon, robots.txt, etc.)
   - Reference assets using absolute paths (e.g., `/logo.png`)

b. Using the `app` directory (Next.js 13+ with App Router):
   - Place route-specific assets directly in the `app` directory
   - Assets are only available to routes within that folder structure

c. Best Practices:
   - Use `public` folder for global assets and files needing public access
   - Use `app` directory for route-specific assets
   - Utilize Next.js `Image` component for optimized image loading

d. Example Usage:
   ```jsx
   import Image from 'next/image';

   <Image
     src="/logo.png"
     alt="Haloweave Jobs Logo"
     width={200}
     height={50}
     priority
   />
   ```

Lesson Learned: Proper asset management improves performance and organization in Next.js applications. The `public` folder and `app` directory serve different purposes for asset placement.

Next Steps:
- Organize existing assets into appropriate folders
- Update image references in components to use the Next.js Image component
- Explore advanced Image component features like placeholder and loading strategies

18. Creating a Bento Grid Style Landing Page with Tailwind CSS

a. Tailwind CSS Setup:
   - Install Tailwind CSS and its dependencies
   - Configure `tailwind.config.js` to scan app directory
   - Add Tailwind directives to global CSS file

b. Bento Grid Layout:
   - Use CSS Grid for layout: `grid grid-cols-1 md:grid-cols-3 gap-6`
   - Create cards of different sizes using `col-span-2` for larger cards
   - Utilize Tailwind's responsive classes for mobile-first design

c. Styling Best Practices:
   - Use Tailwind's utility classes for rapid styling
   - Implement a consistent color scheme with custom colors in Tailwind config
   - Ensure responsiveness using Tailwind's breakpoint prefixes (e.g., `md:`)

d. Next.js Image Component:
   - Utilize `next/image` for optimized image loading
   - Set `width` and `height` props for proper image sizing

e. Accessibility and SEO:
   - Use semantic HTML tags (`<header>`, `<main>`, `<footer>`)
   - Provide descriptive alt text for images

Lesson Learned: Combining Next.js with Tailwind CSS allows for rapid development of modern, responsive layouts like the bento grid style. This approach enhances both developer experience and website performance.

Next Steps:
- Implement interactivity using React hooks or state management
- Enhance SEO with Next.js metadata API
- Add animations to improve user experience
- Integrate with backend API for dynamic content

19. Vercel Deployment Pipeline

a. Local Development:
   - Use `npm run dev` for local development
   - Access app at `http://localhost:3000`
   - Real-time updates with hot reloading

b. Version Control:
   - Regular commits to Git
   - Push changes to GitHub repository

c. Vercel Deployment:
   - Automatic deployments on push to GitHub
   - Each push creates a new deployment

d. Getting a Hosted URL:
   - Sign up for Vercel account
   - Connect GitHub repository to Vercel
   - Automatic deployments provide a unique URL
   - Preview deployments for pull requests
   - Option to set up custom domain

e. Best Practices:
   - Use environment variables for sensitive information
   - Ensure build settings match local setup
   - Utilize Vercel's serverless functions for backend needs

Lesson Learned: Vercel provides a seamless pipeline from local development to live deployment, enabling easy sharing and testing of your application at various stages of development.

Next Steps:
- Set up Vercel account and link GitHub repository
- Configure environment variables in Vercel dashboard
- Test automatic deployments by pushing changes
- Share preview URLs with team for feedback

20. Updating Remote Repository and Vercel Deployment

a. Changing Git Remote:
   - Remove old remote: `git remote remove origin`
   - Add new remote: `git remote add origin https://github.com/haloweavedev/haloweave-jobs.git`
   - Verify change: `git remote -v`
   - Push to new remote: `git push -u origin main`

b. Vercel Deployment Process:
   - Sign in to Vercel
   - Add new project
   - Connect GitHub account
   - Select repository
   - Vercel auto-detects Next.js configuration
   - Deploy project

c. Best Practices:
   - Regularly verify your remote repository URL
   - Ensure all team members update their remote URLs when changes occur
   - Use Vercel's automatic detection for optimal project settings

Lesson Learned: Maintaining accurate remote repository links is crucial for successful collaboration and deployment. Vercel simplifies the deployment process by automatically detecting project configurations.

Next Steps:
- Verify successful deployment on Vercel
- Set up environment variables if needed
- Configure custom domain (if applicable)
- Implement CI/CD pipeline for automated testing before deployment

21. Troubleshooting Git Push to New Remote Repository

a. Verification Steps:
   - Check current branch: `git branch`
   - Check repository status: `git status`
   - Commit any uncommitted changes

b. Force Push to New Remote:
   - Force push current branch: `git push -f origin HEAD`
   - Push main branch if on feature branch:
     ```
     git checkout main
     git push -f origin main
     ```

c. Resetting Remote to Match Local (use with caution):
   ```
   git fetch origin
   git reset --hard origin/main
   git clean -f -d
   git push -f origin main
   ```

d. Best Practices:
   - Always verify the remote URL before pushing
   - Use force push carefully, especially on shared repositories
   - Communicate with team members when changing remote repositories

Lesson Learned: Changing remote repositories can sometimes require additional steps to ensure all files are properly pushed. It's important to verify each step and use force push judiciously.

Next Steps:
- Verify files are visible on GitHub after troubleshooting
- If issues persist, consider cloning the repository fresh and manually copying over your files
- Review GitHub repository settings to ensure proper access and visibility

22. Merging Feature Branch into Main

a. Preparation:
   - Ensure all changes are committed in feature branch:
     ```
     git checkout feature/landing-page
     git status
     git add .
     git commit -m "Finalize changes for landing page"
     ```

b. Merging Process:
   - Switch to main branch: `git checkout main`
   - Merge feature branch: `git merge feature/landing-page`

c. Handling Merge Conflicts:
   - Resolve conflicts in code editor if they occur
   - After resolving, stage and commit:
     ```
     git add .
     git commit -m "Merge feature/landing-page into main"
     ```

d. Updating Remote Repository:
   - Push merged main branch: `git push origin main`

e. Best Practices:
   - Always ensure feature branch is up-to-date with main before merging
   - Use descriptive commit messages for merge commits
   - Consider using pull requests for code review before merging

Lesson Learned: Merging feature branches into main is a key part of the Git workflow, allowing for the integration of new features while maintaining a clear project history.

Next Steps:
- Verify the successful merge on GitHub
- Delete the feature branch if no longer needed
- Start a new feature branch for the next set of changes

23. Resolving Merge Conflicts

a. Identifying Merge Conflicts:
   - Git reports conflicts during merge operation
   - Conflicts typically occur in files modified in both branches
git merge feature/landing-page
b. Resolving Process:
   1. Open conflicting files in text editor
   2. Locate conflict markers (<<<<<<< HEAD, =======, >>>>>>>)
   3. Decide which changes to keep
   4. Remove conflict markers and unwanted code
   5. Save the files

c. Completing the Merge:
   - Stage resolved files: `git add <filename>`
   - Commit the merge: `git commit -m "Merge feature branch, resolve conflicts"`
   - Push changes: `git push origin main`

d. Best Practices:
   - Communicate with team members about conflicting changes
   - Regularly pull from main to minimize conflicts
   - Use Git tools or IDE features for easier conflict resolution

Lesson Learned: Merge conflicts are a normal part of collaborative development. Resolving them requires careful consideration of changes from both branches to ensure the final code is correct and functional.

Next Steps:
- Verify the merged changes on GitHub
- Review the project to ensure it works as expected after the merge
- Consider setting up pre-merge checks or code reviews to catch potential conflicts earlier

25. Implementing Responsive Design with Tailwind CSS in Next.js

a. Mobile-First Approach:
   - Start with mobile layouts and use Tailwind's responsive prefixes (sm:, md:, lg:, xl:) to adjust for larger screens
   - Use flexbox and grid for flexible, responsive layouts

b. Custom Color Scheme:
   - Define custom colors in tailwind.config.js
   - Use CSS variables in globals.css for easy theme management

c. Typography:
   - Integrate custom fonts (e.g., Poppins) using next/

   28. Understanding Project Structure and Global UI Enhancements

a. Utils Folder and Files:
   - The `utils` folder contains utility functions that can be used across the entire application.
   - `smoothScroll.js`: Initializes and manages the Lenis smooth scrolling library.
   - `animations.js`: Sets up GSAP animations that can be applied globally.

   These utility files help separate concerns and keep the main components clean and focused on their primary responsibilities.

b. Components Folder and Layout Component:
   - The `components` folder holds reusable React components.
   - `Layout.tsx`: A wrapper component that applies global UI enhancements.
     - It initializes smooth scrolling and animations using the utility functions.
     - Wraps all pages, ensuring consistent behavior across the entire application.

c. App Layout (app/layout.tsx):
   - The root layout file in Next.js 13+ app directory structure.
   - Incorporates the Layout component to apply global UI enhancements.
   - Includes necessary scripts and metadata for the entire application.

d. Purpose and Benefits:
   - Separation of Concerns: Keeps code organized and maintainable.
   - Reusability: Utility functions and components can be easily used across different parts of the app.
   - Global Application: Ensures consistent UI enhancements across all pages.
   - Performance: Initializes smooth scrolling and animations only once, improving efficiency.

e. Implementation in Pages:
   - To animate specific sections in your pages (e.g., app/page.tsx), add the 'animate-on-scroll' class:
     ```jsx
     <section className="animate-on-scroll">
       {/* Your section content */}
     </section>
     ```

Lesson Learned: Structuring a Next.js project with utility folders, reusable components, and a global layout helps create a more organized, efficient, and maintainable codebase. This approach allows for consistent UI enhancements across the entire application while keeping individual page components clean and focused.

Next Steps:
- Implement error handling in smooth scrolling and animation initialization.
- Create custom hooks for more complex animations if needed.
- Consider adding a configuration file to easily toggle global UI enhancements.

29. Understanding Client and Server Components in Next.js 13+

a. Server Components (Default in app directory):
   - Render on the server, reducing JavaScript sent to the client.
   - Cannot use client-side only features like useState or useEffect.
   - Ideal for static or server-rendered content.

b. Client Components:
   - Marked with 'use client' directive at the top of the file.
   - Can use React hooks and interact with the browser API.
   - Necessary for components that need client-side interactivity.

c. Layout Component as a Client Component:
   - Added 'use client' to Layout.tsx to enable useEffect.
   - Allows initialization of smooth scrolling and animations on the client side.

d. Implications:
   - Client components are downloaded and executed in the browser.
   - May slightly increase initial load time but enable dynamic features.
   - Balance between server and client components is key for optimal performance.

e. Best Practices:
   - Use server components by default for better performance.
   - Switch to client components when necessary for interactivity or client-side APIs.
   - Keep client components as small and focused as possible.

Lesson Learned: In Next.js 13+ with the app directory, understanding the distinction between server and client components is crucial. Properly marking components as client-side when needed ensures that features requiring browser APIs or React hooks function correctly while maintaining the performance benefits of server components where possible.

Next Steps:
- Review other components in the project to ensure proper use of server/client components.
- Consider splitting components into server and client parts where applicable for optimal performance.
- Explore Next.js documentation on React essentials for deeper understanding of this concept.