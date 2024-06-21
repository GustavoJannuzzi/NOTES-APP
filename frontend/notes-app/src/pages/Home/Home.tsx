import EmptyCard from "../../components/EmptyCard/EmptyCard";
import AddNotesImg from "../../assets/images/add-notes.svg"
import NoDataImg from "../../assets/images/no-data.svg"
import Toast from "../../components/ToastMessage/Toast";
import NoteCard from "../../components/Cards/NoteCard";
import axiosInstance from "../../utils/axiosInstance";
import Navbar from "../../components/Navbar/Navbar";
import { useNavigate } from "react-router-dom";
import AddEditNotes from "./AddEditNotes";
import React, { useState, useEffect } from "react";
import { MdAdd } from "react-icons/md";
import Modal from "react-modal";
import useThemeStore from "../../useThemeStore"; // Importando o store do tema

const Home: React.FC = () => {
  const { theme, toggleTheme } = useThemeStore(); // Usando o estado do tema
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShow: false,
    type: "add",
    data: null,
  });

  const [showToastMsg, setShowToastMsg] = useState({
    isShown: false,
    message: "",
    type: "add",
  });

  const [allNotes, setAllNotes] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [isSearch, setIsSearch] = useState(false);
  const [tag, setTag] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const navigate = useNavigate();

  const handleEdit = (noteDetails) => {
    setOpenAddEditModal({ isShow: true, data: noteDetails, type: "edit" });
  };

  const showToastMessage = (message, type) => {
    setShowToastMsg({
      isShown: true,
      message,
      type,
    });
  };

  const handleCloseToast = () => {
    setShowToastMsg({
      isShown: false,
      message: "",
    });
  };

  // Get User info
  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      if (response.data && response.data.user) {
        setUserInfo(response.data.user);
      }
    } catch (error) {
      if (error.response.status == 401) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  // Get all notes
  const getAllNotes = async () => {
    try {
      const response = await axiosInstance.get("/get-all-notes");

      if (response.data && response.data.notes) {
        setAllNotes(response.data.notes);
      }
    } catch (error) {
      console.log("An unexpected error occurred. Please try again.");
    }
  };

  // Delete note
  const deleteNote = async (data) => {
    const noteId = data?._id;

    try {
      const response = await axiosInstance.delete("/delete-note/" + noteId);

      if (response.data && !response.data.error) {
        showToastMessage("Note Deleted Successfully", 'delete');
        getAllNotes();
      }
    } catch (error) {
      if (error.responde && error.response.data && error.response.data.message) {
        console.log("An unexpected error occurred. Please try again.");
      }
    }
  }

  const updateIsPinned = async (noteData) => {
    const noteId = noteData?._id;

    try {
      const response = await axiosInstance.put("/update-note-pinned/" + noteId, {
        "isPinned": !noteData.isPinned,
      });

      if (response.data && response.data.note) {
        showToastMessage("Note Updated Successfully");
        getAllNotes();
      }
    } catch (error) {
      console.log(error);
    }
  }

  // Search for a Note
  const onSearchNote = async (query) => {
    try {
      const response = await axiosInstance.get("/search-notes", {
        params: { query },
      });

      if (response.data && response.data.notes) {
        setIsSearch(true);
        setAllNotes(response.data.notes);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Buscar notas por tag
  const onSearchByTag = async (tag) => {
    try {
      const response = await axiosInstance.get(`/notes-by-tag/${tag}`);
      if (response.data && response.data.notes) {
        setIsSearch(true);
        setAllNotes(response.data.notes);
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Buscar notas por intervalo de data
  const onSearchByDateRange = async (startDate, endDate) => {
    try {
      const response = await axiosInstance.get("/notes-by-date-range", {
        params: { startDate, endDate },
      });
      if (response.data && response.data.notes) {
        setIsSearch(true);
        setAllNotes(response.data.notes);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleClearSearch = () => {
    setIsSearch(false);
    getAllNotes();
  }

  useEffect(() => {
    document.body.className = theme;
    getAllNotes();
    getUserInfo();
    return () => {};
  }, [theme]);

  return (
    <>
      <Navbar 
        userInfo={userInfo} 
        onSearchNote={onSearchNote} 
        handleClearSearch={handleClearSearch} 
      />

      <div className="container mx-auto">
        <div className="flex justify-between mb-4">
            <div>
              <input
                type="text"
                placeholder="Search by Tag"
                value={tag}
                onChange={(e) => setTag(e.target.value)}
                className="border p-2"
              />
              <button
                onClick={() => onSearchByTag(tag)}
                className="ml-2 p-2 bg-blue-500 text-white rounded"
              >
                Search by Tag
              </button>
            </div>
            <div>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="border p-2"
              />
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="border p-2 ml-2"
              />
              <button
                onClick={() => onSearchByDateRange(startDate, endDate)}
                className="ml-2 p-2 bg-blue-500 text-white rounded"
              >
                Search by Date Range
              </button>
            </div>
        </div>
        {allNotes.length > 0 ? (
          <div className="grid grid-cols-3 gap-4 mt-8">
          {allNotes.map((item, index) => (
            <NoteCard
              key={item._id}
              title={item.title}
              date={item.createdOn}
              content={item.content}
              tags={item.tags}
              isPinned={item.isPinned}
              onEdit={() => handleEdit(item)}
              onDelete={() => {deleteNote(item)}}
              onPinNote={() => {updateIsPinned(item)}}
            />
          ))}  
        </div>
        ) : (
          <EmptyCard 
            imgSrc={isSearch ? NoDataImg : AddNotesImg} 
            message={isSearch ? "Oops! No notes found matching your search" : "Start creating your first note! Click the 'Add' button to jot down your thoughts, ideas and reminders. Let's get started!"}
          />
        )}
      </div>

      <button
        className="w-16 h-16 flex items-center justify-center rounded-2xl bg-primary hover:bg-blue-600 absolute right-10 bottom-10"
        onClick={() => {
          setOpenAddEditModal({ isShow: true, type: "add", data: null });
        }}
      >
        <MdAdd className="text-[32px] text-white" />
      </button>

      <Modal
        isOpen={openAddEditModal.isShow}
        onRequestClose={() => {
          setOpenAddEditModal({ isShow: false, type: "add", data: null });
        }}
        style={{
          overlay: {
            backgroundColor: "rgba(0,0,0,0.2)",
          },
        }}
        contentLabel=""
        className="w-[40%] max-h-3/4 bg-white rounded-md mx-auto mt-14 p-5 overflow-sroll"
      >
        <AddEditNotes
          type={openAddEditModal.type}
          noteData={openAddEditModal.data}
          onClose={() => {
            setOpenAddEditModal({ isShow: false, type: "add", data: null });
          }}
          getAllNotes={getAllNotes}
          showToastMessage={showToastMessage}
        />
      </Modal>

      <Toast
        isShown={showToastMsg.isShown}
        message={showToastMsg.message}
        type={showToastMsg.type}
        onClose={handleCloseToast}
      />
    </>
  );
};

export default Home;
