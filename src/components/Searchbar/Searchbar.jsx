import { useState } from 'react';
import s from './Searchbar.module.css';
import { BiSearch } from 'react-icons/bi';
import { toast } from 'react-toastify';

export const Searchbar = ({ onSubmit }) => {
  const [query, setQuery] = useState('');

  const handleNameChange = e => {
    setQuery(e.currentTarget.value.toLowerCase());
  };

  const handleSubmit = e => {
    e.preventDefault();

    if (query.trim() === '') {
      toast.error('Oops! Entered an empty string');
      return;
    }

    onSubmit(query);
    setQuery('');
  };

  return (
    <header className={s['searchbar']}>
      <form className={s['form']} onSubmit={handleSubmit}>
        <button type="submit" className={s['button']}>
          <BiSearch size={25} />
        </button>

        <input
          onChange={handleNameChange}
          className={s['input']}
          type="text"
          autoComplete="off"
          value={query}
          autoFocus
          placeholder="Search images and photos"
        />
      </form>
    </header>
  );
};

export default Searchbar;
