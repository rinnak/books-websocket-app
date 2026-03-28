import {useEffect, useState} from "react";
import {getBooks} from "../services/books";
import type {Book} from "../types"

export const useBooks = () => {
    const [books, setBooks] = useState<Book[]>([]); //список книг

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState<string | null>(null);

    const fetchBooks = async () => {
        try{
            setLoading(true);
            const data = await getBooks();
            setBooks(data);
            setError(null);
        }
        catch {
            setError("Ошибка загрузки книг");
        }
        finally{
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBooks();
    }, [])

    return {
        books,
        loading,
        error,
        refetch: fetchBooks, // функция для повторной загрузки данных для переиспользования, экспорт функции
    }
}