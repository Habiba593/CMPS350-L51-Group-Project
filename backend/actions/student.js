'use server'

import { 
  getAllStudents, 
  getStudentById, 
  createStudent, 
  updateStudent, 
  deleteStudent 
} from '../../repo/student';

import { revalidatePath } from 'next/cache';

export async function addStudent(formData) {
      
    try {
        const student = await createStudent(formData);
        revalidatePath('/students');
        return student;
    } catch (error) {
        console.error('Error creating student:', error);
        throw error;
    }
}


export async function fetchStudents(searchParams) {
      
    try {
        const students = await getAllStudents(searchParams);
        return students;
    } catch (error) {
        console.error('Error fetching students:', error);
        throw error;
    }
}

export async function fetchStudentInfo(id) {
      
    try {
        const student = await getStudentById(id);
        return student;
    } catch (error) {
        console.error('Error fetching student details:', error);
        throw error;
    }
}


export async function updateStudentInfo(formData) {
      
    try {
        const student = await updateStudent(formData.id, formData);
        revalidatePath(`/students/${formData.id}`);
        return student;
    } catch (error) {
        console.error('Error updating student:', error);
        throw error;
    }
}


export async function removeStudent(formData) {
      
    try {
        await deleteStudent(formData.id);
        revalidatePath('/students');
    } catch (error) {
        console.error('Error deleting student:', error);
        throw error;
    }
}