import React from 'react';

interface CommentCardProps {
  author: string;
  content: string;
  date: string; // Or Date object, depending on how you plan to format
}

const CommentCard: React.FC<CommentCardProps> = ({ author, content, date }) => {
  return (
    <div className="bg-gray-800 p-3 rounded-md">
      <p className="text-sm text-gray-300 mb-1">{content}</p>
      <p className="text-xs text-gray-500">
        {author} - {date}
      </p>
    </div>
  );
};

export default CommentCard;
