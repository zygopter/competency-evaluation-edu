import React from 'react';
import { Button } from './ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from './ui/dropdown-menu';

const TopBar = ({ user, onLogout, title }) => {
  const avatarStyle = {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontWeight: 'bold',
    cursor: 'pointer',
  };

  const getAvatarContent = () => {
    if (user.type === 'teacher') {
      return { text: 'P', bgColor: '#4a90e2' };
    } else {
      return { text: 'E', bgColor: '#50c878' };
    }
  };

  const { text, bgColor } = getAvatarContent();

  return (
    <div className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <h1 className="text-xl font-bold">{title}</h1>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            style={{ ...avatarStyle, backgroundColor: bgColor }}
          >
            {text}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-white border-gray-200" align="end">
          <DropdownMenuItem onClick={onLogout} className="text-gray-700 hover:bg-gray-100 cursor-pointer">
            Se déconnecter
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default TopBar;