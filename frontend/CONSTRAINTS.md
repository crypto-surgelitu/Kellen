# Constraints & Guidelines

## Development Rules

1. **No UI/UX Overhauls**: Do NOT change the entire UI/UX of the game. Only fix specific issues or implement requested features. Preserve the existing design language unless explicitly told otherwise.

2. **Phase-Based Development**: Build everything in phases and sprints. Each feature should be implemented incrementally and documented in `ACCOMPLISHMENTS.md` after completion.

3. **Minimal Code Changes**: When fixing bugs or implementing features, make the smallest necessary changes. Avoid refactoring unrelated code.

4. **Preserve Existing Functionality**: Never break existing features when adding new ones. Ensure backward compatibility.

5. **No Undocumented Changes**: Always document progress in `ACCOMPLISHMENTS.md` after completing each phase.

## Testing & Verification

6. **Build Before Commit**: Always run `npm run build` to verify the code compiles without errors before considering the task complete.

7. **Verify in Browser**: Test that changes render correctly in the browser after implementation.

## Design Constraints

8. **Respect Design System**: Follow the established color palette, typography, and spacing defined in `main.css`. Do not introduce new colors or styles without explicit approval.

9. **Responsive First**: Ensure all new features work on mobile, tablet, and desktop viewports.

10. **Accessibility**: Ensure all interactive elements are accessible via touch/click and have proper contrast ratios.

## Project Structure

11. **Single Entry Point**: The app uses a single `main.js` entry point that manages views. Do not create additional HTML pages for new features.

12. **Component-Based**: Add new UI elements as components in `src/components/` following existing patterns.

13. **State Management**: Use the existing `state` object in the Game class to manage application state. Avoid creating new global state variables.

## Communication

14. **Concise Responses**: Keep responses short and to the point. Avoid unnecessary preamble or explanation unless explicitly requested.

15. **Ask Before Large Changes**: If a requested change would require significant refactoring or could break existing functionality, ask for clarification first.