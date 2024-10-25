// exceptions/UnauthorizedError.js

class UnauthorizedError extends Error {
    constructor(message = 'Accès non autorisé') {
      super(message); // Appelle le constructeur de la classe parent (Error)
      this.name = 'UnauthorizedError'; // Nom de l'erreur
      this.status = 401; // Code de statut HTTP pour l'erreur
    }
  }
  
  export { UnauthorizedError };
  