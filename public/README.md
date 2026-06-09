
# TrashDeal  
CS385 Final Project

---

## Project Description

TrashDeal is an interactive React-based web application designed to educate users about proper waste segregation through gameplay. The main game, Trashfall, requires players to drag falling trash items into the correct waste bins. The project combines game mechanics, structured data, and database persistence to promote environmental sustainability.

The application is built entirely using React functional components and demonstrates key frontend concepts such as state management, routing, conditional rendering, custom logic, and database integration.

---

## How to Run the Project

1. Unzip the project folder  
2. Open a terminal inside the project directory  
3. Run the following commands:

```bash
npm install
npm start
````

4. Open `http://localhost:3000` in a web browser

**Note:** The project is primarily intended to be demonstrated via the provided screencast video. Local execution is optional and not required for evaluation.

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

## Author

Name: Pamula Beulah Supragnya
Student ID: 25255440
Module: CS385
Project: Final Project


