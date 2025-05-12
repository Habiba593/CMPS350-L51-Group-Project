'use server'

import { 
  getAllInstructors, 
  getInstructorById, 
  createInstructor, 
  updateInstructor, 
  deleteInstructor 
} from '../../repo/instructor';

import { revalidatePath } from 'next/cache';

export async function addInstructor(formData) {
    try {
        const instructor = await createInstructor(formData);
        revalidatePath('/instructors');
        return instructor;
    } catch (error) {
        console.error('Error creating instructor:', error);
        throw error;
    }
    }

export async function fetchInstructors(searchParams) {
    try {
        const instructors = await getAllInstructors(searchParams);
        return instructors;
    } catch (error) {
        console.error('Error fetching instructors:', error);
        throw error;
    }
}

export async function fetchInstructorInfo(id) {
    try {
        const instructor = await getInstructorById(id);
        return instructor;
    } catch (error) {
        console.error('Error fetching instructor details:', error);
        throw error;
    }
}

export async function updateInstructorInfo(formData) {
    try {
        const instructor = await updateInstructor(formData.id, formData);
        revalidatePath(`/instructors/${formData.id}`);
        return instructor;
    } catch (error) {
        console.error('Error updating instructor:', error);
        throw error;
    }
}

export async function removeInstructor(formData) {
      
    try {
        await deleteInstructor(formData.id);
        revalidatePath('/instructors');
    } catch (error) {
        console.error('Error deleting instructor:', error);
        throw error;
    }
}