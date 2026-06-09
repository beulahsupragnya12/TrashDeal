
# TrashDeal  
CS385 Final Project

---

## Project Description

Overview

TrashDeal is an interactive educational web application developed to promote awareness of proper waste segregation through gamified learning. The application challenges users to correctly sort waste items into appropriate bins while tracking scores through a persistent leaderboard.

The project was developed primarily to explore modern React development practices, with a strong emphasis on component based architecture, state management, event handling, conditional rendering, and interactive user experiences. Rather than focusing on complex backend systems, the project demonstrates how React can be used to build engaging, responsive, and data driven applications.




---


## Application Structure

```
src/
├── pages/
│   ├── Home.js
│   ├── Game.js
│   ├── Leaderboard.js
│
├── trashdata/
│   ├── trashData.json
│   ├── BinGuide.js
│
├── styles/
│   ├── Home.css
│   ├── Game.css
│   ├── Leaderboard.css
│
├── firebase.js
├── App.js
├── index.js
```

---

## Gameplay Functionality (Game.js)

### Game Logic

* Trash items spawn at random horizontal positions
* Items fall using a custom game loop built with `requestAnimationFrame`
* Falling speed depends on the selected difficulty mode
* Collision detection checks if a trash item overlaps with a bin

### Difficulty Modes

Difficulty settings are defined in `Game.js` as configuration values:

* Easy: Slow speed, 20 allowed misses
* Medium: Moderate speed, 15 allowed misses
* Hard: Fast speed, 8 allowed misses

Difficulty selection is implemented using conditional rendering through a dialog box.

---

## Drag and Drop Interaction

Drag-and-drop functionality is implemented in `Game.js` using mouse event handlers:

* `onMouseDown` – Start dragging an item
* `onMouseMove` – Update item position
* `onMouseUp` – Check collision with bins

The dragged item’s position is calculated using mouse offset values stored in component state.

---

## Bins and Trash Data (External JSON)

### Trash Items

Trash items are stored in `trashData.json`. Each item includes:

* id
* type
* emoji representation
* color

Trash items are randomly selected and spawned during gameplay. Using JSON allows easy extension without modifying game logic.



---

## Leaderboard (Firebase Firestore)

### Database Usage

* Firebase Firestore is initialized in `firebase.js`
* Scores are saved using `addDoc()`
* Each leaderboard entry includes:

  * Player name
  * Score
  * Difficulty mode
  * Timestamp

### Leaderboard Display

* Implemented in `Leaderboard.js`
* Scores are queried from Firestore
* Results are ordered by score in descending order
* The leaderboard displays the top 10 scores

This satisfies the rubric requirement for database usage.

---
## Future Enhancements

Several improvements could be implemented to expand the application:

### Enhanced Gameplay

* Additional waste categories
* Bonus rounds and achievements
* Time-based challenges
* Progressive difficulty scaling

### Improved User Experience

* Mobile-responsive drag-and-drop support
* Sound effects and animations
* Accessibility improvements
* Dark mode support

### User Accounts

* User authentication
* Personal score history
* Player profiles
* Saved game progress

### Analytics and Reporting

* Detailed performance statistics
* Waste category learning reports
* User progress tracking
* Interactive visual dashboards

### Technical Improvements

* Migration to TypeScript
* Unit and integration testing
* Performance optimization
* Backend API integration
* Deployment to a cloud platform

---

## Learning Outcomes

Through this project, key skills were developed in:

* React application development
* Component-based architecture
* State management
* Event-driven programming
* Frontend application design
* Database integration with Firebase
* Interactive UI development
* Game logic implementation

---

## Author

Name: Pamula Beulah Supragnya
Student ID: 25255440
Module: CS385
Project: Final Project


