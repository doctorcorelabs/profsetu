// Clear browser autofill cache
// Run this in browser console if fields still show pre-filled values

// Clear localStorage
localStorage.clear();

// Clear sessionStorage
sessionStorage.clear();

// Clear form autofill
document.querySelectorAll('input[type="text"], input[type="password"]').forEach(input => {
  input.value = '';
  input.setAttribute('autocomplete', 'off');
});

console.log('Browser cache cleared. Please refresh the page.');
