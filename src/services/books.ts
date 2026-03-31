import {api} from "./api";
import type {Book,  UpdateBook, UpdateBookRequest} from "../types";

export const getBooks = async (): Promise<Book[]> => {
    const response = await api.get("/book");
    return response.data;
}

export const getBookById = async (id: number): Promise<Book> => {
    const response = await api.get(`/book/`, { params: {id}});
    return response.data;
}

export const createBook = async (data: FormData): Promise<Book> => {
    const response = await api.post("/book", data);
    return response.data;
}

export const updateBook = async (id: number, data: UpdateBookRequest): Promise<Book> => {
    const response = await api.patch(`/book?id=${id}`, data);
    return response.data;
}

export const patchBook = async (id: number, data: UpdateBook): Promise<Book> => {
    const response = await api.patch(`/book?id=${id}`, data);
    return response.data;
}

export const deleteBook = async (id: number): Promise<void> => {
    await api.delete(`/book?id=${id}`);

}