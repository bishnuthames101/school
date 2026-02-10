'use client';

import { useState, useEffect } from 'react';
import { MessageSquare, Search, Mail, Calendar, CheckCircle, Circle, X } from 'lucide-react';

interface Contact {
  id: string;
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: 'unread' | 'read';
  createdAt: string;
}

export default function ContactsManagement() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/contacts?limit=1000');
      if (!response.ok) throw new Error('Failed to fetch contacts');
      const result = await response.json();
      setContacts(result.data || []);
      setError('');
    } catch (err) {
      setError('Failed to load contact messages');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (id: string, currentStatus: string) => {
    try {
      const newStatus = currentStatus === 'read' ? 'unread' : 'read';
      const response = await fetch(`/api/contacts?id=${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) throw new Error('Failed to update status');

      setContacts(
        contacts.map((contact) =>
          contact.id === id ? { ...contact, status: newStatus as 'read' | 'unread' } : contact
        )
      );
    } catch (err) {
      alert('Failed to update status. Please try again.');
      console.error(err);
    }
  };

  const filteredContacts = contacts.filter((contact) => {
    const matchesSearch =
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.subject.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      filterStatus === 'All' ||
      (filterStatus === 'Read' && contact.status === 'read') ||
      (filterStatus === 'Unread' && contact.status === 'unread');

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="h-10 w-10 border-[3px] border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-sm text-gray-500">Loading contact messages...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb + Header */}
      <div>
        <p className="text-sm text-gray-500 mb-1">
          Dashboard &gt; <span className="text-gray-700">Contacts</span>
        </p>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Contact Messages</h1>
          <p className="text-gray-500 mt-1 text-sm">View and manage contact form submissions</p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Stats */}
      {contacts.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Messages</p>
                <p className="text-2xl font-bold text-gray-900">{contacts.length}</p>
              </div>
              <div className="bg-blue-50 p-3 rounded-xl">
                <MessageSquare className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Unread</p>
                <p className="text-2xl font-bold text-orange-600">
                  {contacts.filter((contact) => contact.status === 'unread').length}
                </p>
              </div>
              <div className="bg-orange-50 p-3 rounded-xl">
                <Circle className="h-6 w-6 text-orange-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Read</p>
                <p className="text-2xl font-bold text-green-600">
                  {contacts.filter((contact) => contact.status === 'read').length}
                </p>
              </div>
              <div className="bg-green-50 p-3 rounded-xl">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by name, email, or subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="All">All Messages</option>
              <option value="Unread">Unread</option>
              <option value="Read">Read</option>
            </select>
          </div>
        </div>
      </div>

      {/* Contacts Grid */}
      {filteredContacts.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredContacts.map((contact) => (
            <div
              key={contact.id}
              className={`bg-white rounded-xl border hover:border-gray-300 hover:shadow-md transition-all ${
                contact.status === 'unread' ? 'border-l-4 border-l-blue-600 border-gray-200' : 'border-gray-200'
              }`}
            >
              <div className="p-5">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-3 flex-1">
                    <div className="flex-shrink-0 h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <Mail className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900 truncate">{contact.name}</h3>
                      <p className="text-sm text-gray-500 truncate">{contact.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleStatus(contact.id, contact.status)}
                    className="flex-shrink-0 ml-2"
                    title={contact.status === 'read' ? 'Mark as unread' : 'Mark as read'}
                  >
                    {contact.status === 'read' ? (
                      <CheckCircle className="h-6 w-6 text-green-600 hover:text-green-700" />
                    ) : (
                      <Circle className="h-6 w-6 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>

                {/* Subject */}
                <div className="mb-3">
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Subject:</h4>
                  <p className="text-gray-900">{contact.subject}</p>
                </div>

                {/* Message */}
                <div className="mb-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Message:</h4>
                  <p className="text-gray-700 text-sm line-clamp-4">{contact.message}</p>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="h-4 w-4 mr-1" />
                    {new Date(contact.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                  <button
                    onClick={() => setSelectedContact(contact)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    View Full Message
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {filteredContacts.length === 0 && !error && (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
            <MessageSquare className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {contacts.length === 0 ? 'No contact messages found' : 'No matching messages'}
          </h3>
          <p className="text-gray-500 max-w-sm mx-auto">
            {contacts.length === 0
              ? 'Contact form submissions will appear here.'
              : 'Try adjusting your search or filter criteria.'}
          </p>
        </div>
      )}

      {/* Results Count */}
      {filteredContacts.length > 0 && (
        <div className="text-sm text-gray-500 text-center">
          Showing {filteredContacts.length} of {contacts.length} message
          {contacts.length !== 1 ? 's' : ''}
        </div>
      )}

      {/* Full Message Modal */}
      {selectedContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-2 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full my-4 max-h-[calc(100vh-2rem)] flex flex-col">
            <div className="sticky top-0 bg-white border-b px-4 py-3 sm:px-6 sm:py-4 flex justify-between items-center rounded-t-xl">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Message Details</h2>
              <button
                onClick={() => setSelectedContact(null)}
                className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              >
                <X className="h-5 w-5 sm:h-6 sm:w-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
              {/* Status Badge */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {selectedContact.status === 'read' ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <Circle className="h-5 w-5 text-gray-400" />
                  )}
                  <span
                    className={`text-sm font-medium ${
                      selectedContact.status === 'read' ? 'text-green-600' : 'text-gray-600'
                    }`}
                  >
                    {selectedContact.status === 'read' ? 'Read' : 'Unread'}
                  </span>
                </div>
                <button
                  onClick={() => {
                    toggleStatus(selectedContact.id, selectedContact.status);
                    setSelectedContact({
                      ...selectedContact,
                      status: selectedContact.status === 'read' ? 'unread' : 'read',
                    });
                  }}
                  className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                >
                  Mark as {selectedContact.status === 'read' ? 'Unread' : 'Read'}
                </button>
              </div>

              {/* Contact Info */}
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div>
                  <span className="text-sm font-medium text-gray-700">From: </span>
                  <span className="text-sm text-gray-900">{selectedContact.name}</span>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">Email: </span>
                  <a
                    href={`mailto:${selectedContact.email}`}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    {selectedContact.email}
                  </a>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-700">Date: </span>
                  <span className="text-sm text-gray-900">
                    {new Date(selectedContact.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </span>
                </div>
              </div>

              {/* Subject */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Subject:</h3>
                <p className="text-gray-900 font-medium">{selectedContact.subject}</p>
              </div>

              {/* Message */}
              <div>
                <h3 className="text-sm font-medium text-gray-700 mb-2">Message:</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-900 whitespace-pre-wrap">{selectedContact.message}</p>
                </div>
              </div>

              {/* Action */}
              <div className="pt-4 border-t">
                <a
                  href={`mailto:${selectedContact.email}?subject=Re: ${selectedContact.subject}`}
                  className="w-full inline-flex items-center justify-center space-x-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  <Mail className="h-5 w-5" />
                  <span>Reply via Email</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
