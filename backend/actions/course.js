'use server'

import {
    getAllCourses,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse
} from '../../repo/course';

import { revalidatePath } from 'next/cache';

export async function addCourse(formData) {
    try {
        const course = await createCourse(formData);
        revalidatePath('/courses');
        return course;
    } catch (error) {
        console.error('Error creating course:', error);
        throw error;
    }
}

export async function fetchCourses(searchParams) {
    try {
        const courses = await getAllCourses(searchParams);
        return courses;
    } catch (error) {
        console.error('Error fetching courses:', error);
        throw error;
    }
}

export async function fetchCourseInfo(id) {
    try {
        const course = await getCourseById(id);
        return course;
    } catch (error) {
        console.error('Error fetching course details:', error);
        throw error;
    }
}

export async function updateCourseInfo(formData) {
    try {
        const course = await updateCourse(formData.id, formData);
        revalidatePath(`/courses/${formData.id}`);
        return course;
    } catch (error) {
        console.error('Error updating course:', error);
        throw error;
    }
}

export async function removeCourse(formData) {
      
    try {
        await deleteCourse(formData.id);
        revalidatePath('/courses');
    } catch (error) {
        console.error('Error deleting course:', error);
        throw error;
    }
}