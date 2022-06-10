import { Container } from 'components/Container';
import { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { fetchPictures } from 'services/PixabayApi';
import Searchbar from './Searchbar';
import { Loading } from 'notiflix/build/notiflix-loading-aio';
import Button from 'components/Button';
import Modal from 'components/Modal';
import ImageGallery from './ImageGallery';

const Status = {
  IDLE: 'idle',
  PENDING: 'pending',
  RESOLVED: 'resolved',
  REJECTED: 'rejected',
};

export const App = () => {
  const [query, setQuery] = useState('');
  const [pictures, setPictures] = useState([]);
  const [largeImage, setLargeImage] = useState('');
  const [tags, setTags] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [status, setStatus] = useState(Status.IDLE);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        setStatus(Status.PENDING);

        await fetchPictures(query, page).then(data => {
          const getData = data.hits;
          if (getData.length === 0) {
            setStatus(Status.REJECTED);
            toast.error(
              'Sorry, there are no images matching your search query. Please try again.'
            );
          } else {
            setPictures(state => [...state, ...getData]);
            setTotalPages(Math.ceil(data.totalHits / 12));
            setStatus(Status.RESOLVED);
          }
        });
      } catch (error) {
        toast.warn("We're sorry, the search didn't return any results.");
      }
    };

    if (query === '') return;
    fetchImages();
  }, [page, query]);

  // if (prevState.query !== query || prevState.page !== page)

  const onFormSubmit = q => {
    if (query === q) {
      toast.warn("We're sorry, please enter a different query.");
      return;
    }
    setQuery(q);
    setPage(1);
    setPictures([]);
  };

  const incrementPage = () => {
    setPage(state => state + 1);
  };

  const toggleModal = () => {
    setShowModal(state => !state);
  };

  const setInfoModal = (url, tags) => {
    setLargeImage(url);
    setTags(tags);
    toggleModal();
  };

  return (
    <>
      <ToastContainer onClose={3000} />
      <header>
        <Searchbar onSubmit={onFormSubmit} />
      </header>
      <main>
        <Container>
          {status === Status.PENDING && (
            <>
              {Loading.circle('Loading...')}
              <ImageGallery pictures={pictures} setInfoModal={setInfoModal} />
              {pictures.length !== 0 && totalPages !== 0 && (
                <Button incrementPage={incrementPage} />
              )}
            </>
          )}
          {status === Status.RESOLVED && (
            <>
              {Loading.remove()}
              <ImageGallery pictures={pictures} setInfoModal={setInfoModal} />
              {showModal && (
                <Modal
                  onClose={toggleModal}
                  largeImage={largeImage}
                  tags={tags}
                />
              )}
            </>
          )}
          {status === Status.RESOLVED && page < totalPages && (
            <Button incrementPage={incrementPage} />
          )}
        </Container>
      </main>
    </>
  );
};
