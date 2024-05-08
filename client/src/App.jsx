import React, { useState, useEffect } from "react";
import Todo from "./Todo";

export default function App() {
  const [todos, setTodos] = useState([]);
  const [content, setContent] = useState("");

  useEffect(() => {
    async function getTodos() {
      try {
        const res = await fetch("/api/todos");
        const todos = await res.json();
  
        setTodos(todos); 
      } catch (error) {
        console.error("Error fetching todos:", error);
      }
    }
  
    getTodos();
  }, []);

  const createNewTodo = async (e) => {
    e.preventDefault();
    if (content.length > 3) {
      const res = await fetch("/api/todos", {
        method: "POST",
        body: JSON.stringify({ todo: content }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      const newTodo = await res.json();

      setContent("");
      setTodos([...todos, newTodo]);

      document.querySelector(".form__input").focus();
    }
  }

  return (
    <main className="container">
  <h1 className="title">Must Have Todos</h1>
  <form className="form" onSubmit={createNewTodo}>
    <input 
      type="text"
      value={content}
      onChange={(e) => setContent(e.target.value)}
      placeholder="Enter a new todo..."
      className="form__input"
      required 
      aria-label="Enter a new todo" // ARIA label for input
    />
    <button className="form__button" type="submit">Create Todo</button>
  </form>
  <div className="todos" role="list">
    {todos.length > 0 &&
      todos.map(todo => (
        todo.todo ? <Todo key={todo._id} todo={todo} setTodos={setTodos} /> : null
      ))
    }
  </div>
  <span>
    Montego Bay, located on the north coast of Jamaica, 
    is a popular tourist destination known for its beautiful beaches, vibrant culture, and diverse range of activities.
    Here are some things you can do in Montego Bay.
  </span>
  
  <h3>Things to Do</h3>
  <ul>
    <li>Relax on the Beaches: Montego Bay boasts some stunning beaches, including Doctor's Cave Beach, Cornwall Beach, and Walter Fletcher Beach.</li>
    <li>Go Snorkeling or Scuba Diving</li>
    <li>Visit the Montego Bay Marine Park</li>
    <li>Sample Jamaican Cuisine</li>
    <li>Play Golf</li>
  </ul>
  <h4>More on Jamaica</h4>
  <p>
    Explore the paradise Montego Bay boasts some of the most stunning beaches in Jamaica, with soft
    white sand and crystal-clear turquoise waters. Whether you're looking to sunbathe, swim, or enjoy water
    sports, the beaches in Montego Bay offer the perfect setting.
  </p>
  <p>
    If you are traveling with little ones, check out AquaSol Theme Park: 
    AquaSol Theme Park is a waterfront park located in Montego Bay, offering a 
    variety of activities for kids. Enjoy water slides, splash pools, pedal boats, and a playground.
    There are also picnic areas and food vendors on-site.
  </p>
  <p>
    Adventure Caving: For more adventurous travelers, there are guided tours that involve climbing, 
    crawling, and rappelling through caves. These tours are designed for participants who are physically
    fit and comfortable with challenging terrain. 
    They offer a thrilling and immersive way to explore the hidden depths of Jamaica's caves.
  </p>
  <footer className="footer">
    <p>
      If you require further information or assistance, please feel free to contact me via email at <a href="mailto:efinner14@gmail.com">efinner14@gmail.com</a> I am available to provide personalized recommendations and curated lists of activities tailored to your preferences and interests.
    </p>
  </footer>
</main>

  );
}
