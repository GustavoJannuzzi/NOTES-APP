import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProfileInfo from '../Cards/ProfileInfo';
import SearchBar from '../SearchBar/SearchBar';
import useThemeStore from '../../useThemeStore';

const Navbar: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState("");
    const navigate = useNavigate();
    const { theme, toggleTheme } = useThemeStore();

    const onLogout = () => {
        navigate("/login");
    };

    const handleSearch = () => {};

    const onClearSearch = () => {
        setSearchQuery("");
    };

    // Aplicar a classe de tema no body
    useEffect(() => {
        document.body.className = theme;
    }, [theme]);

    return (
        <div className={'bg-white flex items-center justify-between px-6 py-2 drop-shadow'}>
            <h2 className="text-xl font-medium  py-2">Notes</h2>

            <SearchBar
                value={searchQuery}
                onChange={({ target }) => {
                    setSearchQuery(target.value);
                }}
                handleSearch={handleSearch}
                onClearSearch={onClearSearch}
            />

            <div className="flex items-center">
                <button
                    className="mr-4 p-2 rounded-md border"
                    onClick={toggleTheme}
                >
                    Alternar Tema
                </button>
                <ProfileInfo onLogout={onLogout} />
            </div>
        </div>
    );
};

export default Navbar;
