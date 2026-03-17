import React from 'react';

export interface FooterProps {
  author: string;
  authorLink: string;
  year: number;
  showHeart?: boolean;
}

export const Footer: React.FC<FooterProps> = ({
  author,
  authorLink,
  year,
  showHeart = true,
}) => {
  return (
    <footer className="text-center text-sm text-muted-foreground mt-8 pb-4">
      <p>
        {showHeart && 'Made with ❤️ '}
        {showHeart && 'by '}
        <a
          href={authorLink}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary hover:underline font-medium"
        >
          {author}
        </a>
        {' | © '}
        {year}
      </p>
    </footer>
  );
};

