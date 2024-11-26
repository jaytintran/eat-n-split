import { useState } from "react";

const initialFriends = [
  {
    id: 118836,
    name: "Clark",
    image: "https://i.pravatar.cc/48?u=118836",
    balance: -7,
  },
  {
    id: 933372,
    name: "Sarah",
    image: "https://i.pravatar.cc/48?u=933372",
    balance: 20,
  },
  {
    id: 499476,
    name: "Anthony",
    image: "https://i.pravatar.cc/48?u=499476",
    balance: 0,
  },
];

import React from "react";

export default function App() {
  const [friends, setFriends] = useState(initialFriends);
  const [showAddFriend, setShowAddFriend] = useState(false);
  const [selectedFriend, setSelectedFriend] = useState(null);

  function handleShowAddFriend() {
    setShowAddFriend(!showAddFriend);
  }

  function handleAddFriend(friend) {
    setFriends((friends) => [...friends, friend]);
    showAddFriend(false);
  }

  function handleSelectFriend(friend) {
    // cur represents the current value of selectedFriend.
    setSelectedFriend((cur) => (cur?.id === friend.id ? null : friend));
  }

  function handleSplitBill(value) {
    console.log(value);

    setFriends((previousFriendsArray) =>
      previousFriendsArray.map((friend) =>
        friend.id === selectedFriend.id
          ? { ...friend, balance: friend.balance + value }
          : friend
      )
    );
  }

  return (
    <div className="app">
      <div className="sidebar">
        <FriendList
          friends={friends}
          onSelectFriend={handleSelectFriend}
          selectedFriend={selectedFriend}
        />

        {showAddFriend && <FormAddFriend handleAddFriend={handleAddFriend} />}

        <Button onClick={handleShowAddFriend}>
          {showAddFriend ? "Close" : "Add New Friend"}
        </Button>
      </div>

      {selectedFriend && (
        <FormSplitBill
          selectedFriend={selectedFriend}
          onSplitBill={handleSplitBill}
        />
      )}
    </div>
  );
}

function FriendList({ friends, onSelectFriend, selectedFriend }) {
  return (
    <ul>
      {friends.map((friend) => (
        <Friend
          key={friend.id}
          friend={friend}
          onSelectFriend={onSelectFriend}
          selectedFriend={selectedFriend}
        />
      ))}
    </ul>
  );
}

function Friend({ friend, onSelectFriend, selectedFriend }) {
  const isSelected = friend?.id === selectedFriend?.id;

  return (
    <li>
      <img src={friend.image} alt={friend.name} />
      <h3>{friend.name}</h3>
      {friend.balance < 0 && (
        <p className="red">
          You owe {friend.name} ${Math.abs(friend.balance)}€
        </p>
      )}
      {friend.balance > 0 && (
        <p className="green">
          {friend.name} owes you ${Math.abs(friend.balance)}€
        </p>
      )}
      {friend.balance === 0 && (
        <p className="">You and {friend.name} are even</p>
      )}
      <Button onClick={() => onSelectFriend(friend)}>
        {isSelected ? "Close" : "Select"}
      </Button>
    </li>
  );
}

function FormAddFriend({ handleAddFriend }) {
  const [name, setName] = useState("");
  const [image, setImage] = useState("https://i.pravatar.cc/48");

  // Add new friend on submit
  function onSubmit(e) {
    e.preventDefault();
    const newFriendId = crypto.randomUUID();

    if (!name || !image) return;

    const newFriend = {
      id: newFriendId,
      name: name,
      image: `${image}?=${newFriendId}`,
      balance: 0,
    };

    setName("");
    setImage("https://i.pravatar.cc/48");

    handleAddFriend(newFriend);
  }
  return (
    <form className="form-add-friend" onSubmit={onSubmit}>
      <label>🫂 Name</label>
      <input type="text" onChange={(e) => setName(e.target.value)} />

      <label>📷 Image URL</label>
      <input
        type="text"
        onChange={(e) => setImage(e.target.value)}
        value={image}
      />

      <Button type={"submit"}>Add</Button>
    </form>
  );
}

function Button({ children, type, onClick }) {
  return (
    <button className="button" type={type} onClick={onClick}>
      {children}
    </button>
  );
}

function FormSplitBill({ selectedFriend, onSplitBill }) {
  const [whoIsPaying, setWhoIsPaying] = useState("user");
  const [billValue, setBillValue] = useState(0);
  const [yourExpense, setYourExpense] = useState(0);
  const friendExpense = billValue ? billValue - yourExpense : "";

  function handleSplitBill(e) {
    e.preventDefault();

    if (!billValue || !friendExpense || !yourExpense) return;

    onSplitBill(whoIsPaying === "user" ? friendExpense : -yourExpense);

    // After split reset values
    setBillValue(0);
    setYourExpense(0);
  }

  return (
    <form className="form-split-bill" onSubmit={handleSplitBill}>
      <h2>Split a bill with {selectedFriend.name}</h2>

      <label>💰 Bill Value</label>
      <input
        type="number"
        value={billValue}
        onChange={(e) => setBillValue(e.target.value)}
      />

      <label>👱‍♀️ Your Expense</label>
      <input
        type="number"
        value={yourExpense}
        onChange={(e) => setYourExpense(e.target.value)}
      />

      <label>🧑 {selectedFriend.name}'s Expense</label>
      <input
        type="number"
        value={friendExpense}
        onChange={(e) => setFriendExpense(e.target.value)}
        disabled
      />

      <label>🤑 Who is paying the bill</label>
      <select
        value={whoIsPaying}
        onChange={(e) => setWhoIsPaying(e.target.value)}
      >
        <option value="user">You</option>
        <option value="friend">{selectedFriend.name}</option>
      </select>

      <Button type={"submit"}>Split Bill</Button>
    </form>
  );
}
