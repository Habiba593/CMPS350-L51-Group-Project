'use server'

import {
    getAllClasses,
    getClassById,
    createClass,
    updateClass,
    deleteClass
} from '../../repo/class';

import { revalidatePath } from 'next/cache';

export async function addClass(formData) {
    try {
        const classData = await createClass(formData);
        revalidatePath('/classes');
        return classData;
    } catch (error) {
        console.error('Error creating class:', error);
        throw error;
    }
}

export async function fetchClasses(searchParams) {
    try {
        const classes = await getAllClasses(searchParams);
        return classes;
    } catch (error) {
        console.error('Error fetching classes:', error);
        throw error;
    }
}

export async function fetchClassInfo(id) {
    try {
        const classData = await getClassById(id);
        return classData;
    } catch (error) {
        console.error('Error fetching class details:', error);
        throw error;
    }
}

export async function updateClassInfo(formData) {
    try {
        const classData = await updateClass(formData.id, formData);
        revalidatePath(`/classes/${formData.id}`);
        return classData;
    } catch (error) {
        console.error('Error updating class:', error);
        throw error;
    }
}

export async function removeClass(formData) {
      
    try {
        await deleteClass(formData.id);
        revalidatePath('/classs');
    } catch (error) {
        console.error('Error deleting class:', error);
        throw error;
    }
}