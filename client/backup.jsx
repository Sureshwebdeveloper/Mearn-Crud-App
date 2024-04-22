import React, { useState, useEffect } from "react";

const Todo = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [todos, setTodo] = useState([]);
  const [error, setError] = useState("");
  const [messgage, setMessage] = useState("");
  const [editId, setEditId] = useState(-1);
  const [edittitle, setEditTitle] = useState("");
  const [editdescription, setEditDescription] = useState("");

  const apiurl = "http://localhost:9000";

  const handleData = () => {
    setError("");
    if (title.trim() !== "" && description.trim() !== "") {
      fetch(apiurl + "/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, description }),
      })
        .then((res) => {
          if (res.ok) {
            setTodo([...todos, { title, description }]);
            setTitle("");
            setDescription("");
            setMessage("Item Added Successfully");
            setTimeout(() => {
              setMessage("");
            }, 3000);
          } else {
            setError("Unable To create Todo item");
          }
        })
        .catch(() => {
          setError("Unable To create Todo item");
        });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  useEffect(() => {
    getItems();
  }, []);

  const getItems = () => {
    fetch(apiurl + "/todos")
      .then((res) => res.json())
      .then((res) => setTodo(res));
  };

  const handleEdit = (item) => {
    setEditId(item._id);
    setEditTitle(item.title);
    setEditDescription(item.description);
  };

  const handleUpdate = () => {
    setError("");
    if (edittitle.trim() !== "" && editdescription.trim() !== "") {
      fetch(apiurl + "/todos/" + editId, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: edittitle,
          description: editdescription,
        }),
      })
        .then((res) => {
          if (res.ok) {
            // Update Todos
            const updatedTodos = todos.map((item) => {
              if (item._id == editId) {
                item.title = edittitle;
                item.description = editdescription;
              }
              return item;
            });

            setTodo(updatedTodos);
            setEditTitle("");
            setEditDescription("");
            setMessage("Item Updated Successfully");
            setTimeout(() => {
              setMessage("");
            }, 3000);

            setEditId(-1);
          } else {
            setError("Unable To Update Todo item");
          }
        })
        .catch(() => {
          setError("Unable To create Todo item");
        });
    }
  };

  const handleEditCancel = () => {
    setEditId(-1);
  };

  const handleDelete = (id) => {
    console.log("onClicked");
    if (confirm("Are You Sure Want to delete?")) {
      fetch(apiurl + "/todos/" + id, {
        method: "DELETE",
      }).then(() => {
        const updatedTodos = todos.filter((item) => item._id !== id);
        setTodo(updatedTodos);
      });
      setMessage("Item Deleted Successfully");
      setTimeout(() => {
        setMessage("");
      }, 3000);
    } else {
      setMessage("Sorry Unable to Delete");
      setTimeout(() => {
        setMessage("");
      }, 3000);
    }
  };

  console.log("title", todos.length);

  return (
    <div className={" text-center pb-40 w-full"}>
      <h1 className="font-mono font-bold text-white py-3 text-2xl rounded-md">
        ToDo Project With Mern Stack
      </h1>
      <div className="">
        <h1 className="text-center mt-5 text-xl font-semibold">Add Item</h1>
        {messgage && (
          <p className=" text-green-300 shadow-sm font-bold text-lg text-center">
            {messgage}
          </p>
        )}
        <form
          className="flex justify-center items-center flex-wrap  pb-5 mt-5 w-full space-y-3 space-x-3"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            placeholder="Title"
            className="rounded py-2 mt-3 w-1/4 placeholder:text-center"
            id="todo"
            value={title}
            required
            onChange={(e) => setTitle(e.target.value)}
          />

          <input
            type="text"
            placeholder="Description"
            className="rounded py-2  w-1/4 placeholder:text-center"
            value={description}
            required
            onChange={(e) => setDescription(e.target.value)}
            id="todo"
          />

          <button
            className="bg-slate-950 text-white text-base w-1/12 py-2 rounded"
            onClick={handleData}
          >
            Submit
          </button>
        </form>
        {error && (
          <p className="text-black font-bold text-lg text-center">{error}</p>
        )}
      </div>
      {/* <div className="mt-3 w-10/12  mx-auto"> */}
      <div className="mt-3 w-1/3 grid  mx-auto">
        <span className="text-lg font-bold text-black bg-teal-50 text-center px-7 rounded-md">
          Tasks
        </span>
        <ul>
          {todos.map((item, index) => {
            return (
              <li
                className=" flex justify-around items-center bg-[#eeeeee]  my-2 rounded-lg"
                key={index}
              >
                <div className="flex flex-col gap-y-1">
                  {editId == -1 || editId !== item._id ? (
                    <>
                      <span className="font-bold">{item.title}</span>
                      <span className="font-bold">{item.description}</span>
                    </>
                  ) : (
                    <>
                      <form
                        className="flex justify-center items-center  pb-5 mt-5 w-full space-x-4"
                        onSubmit={handleSubmit}
                      >
                        <input
                          type="text"
                          placeholder="Title"
                          className="rounded py-2 w-1/2 pl-3 bg-blue-300 caret-rose-50 placeholder:text-center  placeholder:text-black outline-none"
                          id="todo"
                          value={edittitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                        />

                        <input
                          type="text"
                          placeholder="Description"
                          className={
                            "rounded py-2 w-1/2 pl-3 bg-blue-300 caret-rose-50  placeholder:text-center placeholder:text-black  outline-none" +
                            (error ? "transition-transform" : "")
                          }
                          value={editdescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          id="todo"
                        />
                      </form>
                    </>
                  )}
                </div>
                <div className="flex items-center justify-between gap-5 mx-2 ">
                  {editId == -1 || editId !== item._id ? (
                    <>
                      <button
                        className="px-3 py-1 bg-slate-600 rounded-md text-white"
                        onClick={() => handleEdit(item)}
                      >
                        Edit
                      </button>
                      <button
                        className="px-3 py-1 bg-red-600 rounded-md text-white"
                        onClick={() => handleDelete(item._id)}
                      >
                        Delete
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        className="px-3 py-1 bg-yellow-500 rounded-md text-black"
                        onClick={handleUpdate}
                      >
                        Update
                      </button>
                      {editId == -1 ? (
                        <button className="px-3 bg-red-600 rounded-md text-white">
                          Delete
                        </button>
                      ) : (
                        <button
                          className="px-3 py-1 bg-red-600 rounded-md text-white"
                          onClick={handleEditCancel}
                        >
                          Cancel
                        </button>
                      )}
                    </>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Todo;
