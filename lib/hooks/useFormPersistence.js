import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

/**
 * Custom hook for form persistence using localStorage
 * @param {string} storageKey - Unique key for localStorage
 * @param {object} defaultValues - Default form values
 * @param {object} formOptions - Additional form options
 * @returns {object} Form object with persistence
 */
export function useFormPersistence(storageKey, defaultValues, formOptions = {}) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [dataRestored, setDataRestored] = useState(false)

  const form = useForm({
    defaultValues,
    ...formOptions
  })

  // Save form data to localStorage whenever form values change
  useEffect(() => {
    if (isLoaded) {
      const subscription = form.watch((value) => {
        localStorage.setItem(storageKey, JSON.stringify(value))
      })
      return () => subscription.unsubscribe()
    }
  }, [form, isLoaded, storageKey])

  // Restore form data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem(storageKey)
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData)
        console.log(`Restoring saved form data for ${storageKey}:`, parsedData)
        
        // Restore form values
        Object.keys(parsedData).forEach(key => {
          if (parsedData[key] !== undefined && parsedData[key] !== null) {
            form.setValue(key, parsedData[key])
          }
        })
        setDataRestored(true)
      } catch (error) {
        console.error(`Error parsing saved form data for ${storageKey}:`, error)
      }
    }
    setIsLoaded(true)
  }, [form, storageKey])

  const clearSavedData = () => {
    localStorage.removeItem(storageKey)
    form.reset()
    setDataRestored(false)
  }

  const saveFormData = (data) => {
    localStorage.setItem(storageKey, JSON.stringify(data))
  }

  return {
    form,
    isLoaded,
    dataRestored,
    clearSavedData,
    saveFormData
  }
}
