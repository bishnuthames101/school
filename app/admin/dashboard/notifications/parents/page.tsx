'use client';

import { useState, useEffect } from 'react';
import { Plus, Edit2, X, Users, GraduationCap, Trash2 } from 'lucide-react';

// Types
interface SchoolClass {
  id: string;
  name: string;
  section: string | null;
}

interface Parent {
  id: string;
  studentName: string;
  parentName: string;
  phone: string;
  classId: string | null;
  class: SchoolClass | null;
  isActive: boolean;
}

interface ParentFormData {
  studentName: string;
  parentName: string;
  phone: string;
  classId: string;
}

const EMPTY_FORM: ParentFormData = {
  studentName: '',
  parentName: '',
  phone: '',
  classId: '',
};

function classLabel(c: SchoolClass | null): string {
  if (!c) return '—';
  return c.section ? `${c.name} - ${c.section}` : c.name;
}

// Mask phone for display: show first 5 and last 2 digits, mask the rest
// e.g. 9779810323270 → 97798•••••70
function maskPhone(phone: string): string {
  if (phone.length <= 7) return phone;
  const visible = phone.slice(0, 5);
  const tail = phone.slice(-2);
  const masked = '•'.repeat(phone.length - 7);
  return `${visible}${masked}${tail}`;
}

export default function ManageParentsPage() {
  const [parents, setParents] = useState<Parent[]>([]);
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [addForm, setAddForm] = useState<ParentFormData>(EMPTY_FORM);
  const [addSubmitting, setAddSubmitting] = useState(false);
  const [addError, setAddError] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<ParentFormData>(EMPTY_FORM);
  const [editSubmitting, setEditSubmitting] = useState(false);

  // Classes management state
  const [showClassForm, setShowClassForm] = useState(false);
  const [classForm, setClassForm] = useState({ name: '', section: '' });
  const [classSubmitting, setClassSubmitting] = useState(false);
  const [classError, setClassError] = useState('');

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [parentsRes, classesRes] = await Promise.all([
        fetch('/api/parents'),
        fetch('/api/classes'),
      ]);
      const parentsData = await parentsRes.json();
      const classesData = await classesRes.json();

      if (parentsData.success) setParents(parentsData.data);
      if (classesData.success) setClasses(classesData.data);
      setError('');
    } catch {
      // [UI TEXT - can be translated to Nepali]
      setError('Failed to load parents');
    } finally {
      setLoading(false);
    }
  };

  // Count per class for summary row
  const classCounts = classes.map((c) => ({
    label: classLabel(c),
    count: parents.filter((p) => p.classId === c.id && p.isActive).length,
  }));
  const noClassCount = parents.filter((p) => !p.classId && p.isActive).length;

  const activeCount = parents.filter((p) => p.isActive).length;

  const handleAddClass = async () => {
    if (!classForm.name.trim()) {
      setClassError('Class name is required');
      return;
    }
    setClassSubmitting(true);
    setClassError('');
    try {
      const res = await fetch('/api/classes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: classForm.name.trim(),
          section: classForm.section.trim() || undefined,
        }),
      });
      const data = await res.json();
      if (!data.success) {
        setClassError(data.error || 'Failed to add class');
        return;
      }
      setClasses((prev) => [...prev, data.data].sort((a, b) => a.name.localeCompare(b.name)));
      setClassForm({ name: '', section: '' });
      setShowClassForm(false);
    } catch {
      setClassError('Failed to add class. Please try again.');
    } finally {
      setClassSubmitting(false);
    }
  };

  const handleAddSave = async () => {
    if (!addForm.studentName.trim() || !addForm.parentName.trim() || !addForm.phone.trim()) {
      // [UI TEXT - can be translated to Nepali]
      setAddError('Student name, parent name, and phone are required');
      return;
    }

    setAddSubmitting(true);
    setAddError('');

    try {
      const res = await fetch('/api/parents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: addForm.studentName,
          parentName: addForm.parentName,
          phone: addForm.phone,
          classId: addForm.classId || undefined,
        }),
      });

      const data = await res.json();
      if (!data.success) {
        setAddError(data.error || 'Failed to add parent');
        return;
      }

      await fetchAll();
      setShowAddForm(false);
      setAddForm(EMPTY_FORM);
    } catch {
      // [UI TEXT - can be translated to Nepali]
      setAddError('Failed to add parent. Please try again.');
    } finally {
      setAddSubmitting(false);
    }
  };

  const handleEditStart = (parent: Parent) => {
    setEditingId(parent.id);
    setEditForm({
      studentName: parent.studentName,
      parentName: parent.parentName,
      phone: parent.phone,
      classId: parent.classId ?? '',
    });
  };

  const handleEditSave = async (id: string) => {
    if (!editForm.studentName.trim() || !editForm.parentName.trim() || !editForm.phone.trim()) {
      return;
    }

    setEditSubmitting(true);

    try {
      const res = await fetch(`/api/parents/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentName: editForm.studentName,
          parentName: editForm.parentName,
          phone: editForm.phone,
          classId: editForm.classId || undefined,
        }),
      });

      const data = await res.json();
      if (!data.success) return;

      await fetchAll();
      setEditingId(null);
    } catch {
      console.error('Failed to update parent');
    } finally {
      setEditSubmitting(false);
    }
  };

  const handleDeactivate = async (id: string) => {
    // [UI TEXT - can be translated to Nepali]
    if (!confirm('Deactivate this parent? They will no longer receive notifications.')) return;

    try {
      const res = await fetch(`/api/parents/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) await fetchAll();
    } catch {
      console.error('Failed to deactivate parent');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="h-10 w-10 border-[3px] border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto" />
          {/* [UI TEXT - can be translated to Nepali] */}
          <p className="mt-4 text-sm text-gray-500">Loading parents...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Breadcrumb + Header */}
      <div>
        {/* [UI TEXT - can be translated to Nepali] */}
        <p className="text-sm text-gray-500 mb-1">
          Dashboard &gt; Notifications &gt; <span className="text-gray-700">Manage Parents</span>
        </p>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* [UI TEXT - can be translated to Nepali] */}
            <h1 className="text-2xl font-bold text-gray-900">Manage Parents</h1>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
              {activeCount}
            </span>
          </div>
          {!showAddForm && (
            <button
              onClick={() => { setShowAddForm(true); setAddError(''); setAddForm(EMPTY_FORM); }}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors self-start"
            >
              <Plus className="h-5 w-5" />
              {/* [UI TEXT - can be translated to Nepali] */}
              <span>Add Parent</span>
            </button>
          )}
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Manage Classes section */}
      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-4 w-4 text-gray-500" />
            {/* [UI TEXT - can be translated to Nepali] */}
            <h2 className="text-sm font-semibold text-gray-800">Classes</h2>
            <span className="text-xs text-gray-400">({classes.length})</span>
          </div>
          {!showClassForm && (
            <button
              onClick={() => { setShowClassForm(true); setClassError(''); setClassForm({ name: '', section: '' }); }}
              className="flex items-center gap-1.5 text-xs text-blue-600 hover:text-blue-800 font-medium"
            >
              <Plus className="h-3.5 w-3.5" />
              {/* [UI TEXT - can be translated to Nepali] */}
              Add Class
            </button>
          )}
        </div>

        {/* Existing classes as chips */}
        {classes.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {classes.map((c) => (
              <span key={c.id} className="inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                {classLabel(c)}
              </span>
            ))}
          </div>
        )}

        {/* No classes hint */}
        {classes.length === 0 && !showClassForm && (
          <p className="text-xs text-gray-400 mb-2">
            {/* [UI TEXT - can be translated to Nepali] */}
            No classes yet. Add a class so you can assign parents to it.
          </p>
        )}

        {/* Inline add class form */}
        {showClassForm && (
          <div className="flex flex-wrap items-end gap-3 pt-2 border-t border-gray-100 mt-2">
            <div>
              {/* [UI TEXT - can be translated to Nepali] */}
              <label className="block text-xs font-medium text-gray-600 mb-1">Class Name *</label>
              <input
                type="text"
                value={classForm.name}
                onChange={(e) => setClassForm({ ...classForm, name: e.target.value })}
                className="w-36 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g. Class 10"
                autoFocus
              />
            </div>
            <div>
              {/* [UI TEXT - can be translated to Nepali] */}
              <label className="block text-xs font-medium text-gray-600 mb-1">Section <span className="text-gray-400 font-normal">(optional)</span></label>
              <input
                type="text"
                value={classForm.section}
                onChange={(e) => setClassForm({ ...classForm, section: e.target.value })}
                className="w-24 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g. A"
              />
            </div>
            <div className="flex gap-2 items-center">
              <button
                onClick={handleAddClass}
                disabled={classSubmitting}
                className="px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {/* [UI TEXT - can be translated to Nepali] */}
                {classSubmitting ? 'Saving...' : 'Save'}
              </button>
              <button
                onClick={() => { setShowClassForm(false); setClassError(''); }}
                className="px-3 py-1.5 border border-gray-300 text-gray-600 text-xs font-medium rounded-lg hover:bg-gray-50 transition-colors"
              >
                {/* [UI TEXT - can be translated to Nepali] */}
                Cancel
              </button>
            </div>
            {classError && <p className="w-full text-xs text-red-600">✗ {classError}</p>}
          </div>
        )}
      </div>

      {/* Class summary row */}
      {(classCounts.some((c) => c.count > 0) || noClassCount > 0) && (
        <div className="flex flex-wrap gap-3 text-sm text-gray-600">
          {classCounts.filter((c) => c.count > 0).map((c) => (
            <span key={c.label} className="bg-gray-100 px-3 py-1 rounded-full">
              {c.label}: <span className="font-semibold">{c.count}</span>
            </span>
          ))}
          {noClassCount > 0 && (
            <span className="bg-gray-100 px-3 py-1 rounded-full">
              {/* [UI TEXT - can be translated to Nepali] */}
              No class: <span className="font-semibold">{noClassCount}</span>
            </span>
          )}
        </div>
      )}

      {/* Inline Add Form */}
      {showAddForm && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 space-y-4">
          {/* [UI TEXT - can be translated to Nepali] */}
          <h2 className="text-sm font-semibold text-blue-900">Add New Parent</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              {/* [UI TEXT - can be translated to Nepali] */}
              <label className="block text-xs font-medium text-gray-700 mb-1">Student Name *</label>
              <input
                type="text"
                value={addForm.studentName}
                onChange={(e) => setAddForm({ ...addForm, studentName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Student name"
              />
            </div>
            <div>
              {/* [UI TEXT - can be translated to Nepali] */}
              <label className="block text-xs font-medium text-gray-700 mb-1">Parent Name *</label>
              <input
                type="text"
                value={addForm.parentName}
                onChange={(e) => setAddForm({ ...addForm, parentName: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Parent name"
              />
            </div>
            <div>
              {/* [UI TEXT - can be translated to Nepali] */}
              <label className="block text-xs font-medium text-gray-700 mb-1">WhatsApp Number *</label>
              <div className="flex items-center">
                <span className="px-3 py-2 bg-gray-100 border border-r-0 border-gray-300 rounded-l-lg text-sm text-gray-600 whitespace-nowrap">
                  +977
                </span>
                <input
                  type="tel"
                  value={addForm.phone}
                  onChange={(e) => setAddForm({ ...addForm, phone: e.target.value })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-r-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="98XXXXXXXX"
                />
              </div>
            </div>
            <div>
              {/* [UI TEXT - can be translated to Nepali] */}
              <label className="block text-xs font-medium text-gray-700 mb-1">Class</label>
              <select
                value={addForm.classId}
                onChange={(e) => setAddForm({ ...addForm, classId: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {/* [UI TEXT - can be translated to Nepali] */}
                <option value="">— Select class —</option>
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>{classLabel(c)}</option>
                ))}
              </select>
            </div>
          </div>

          {addError && (
            <p className="text-sm text-red-600">✗ {addError}</p>
          )}

          <div className="flex gap-3">
            <button
              onClick={handleAddSave}
              disabled={addSubmitting}
              className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {/* [UI TEXT - can be translated to Nepali] */}
              {addSubmitting ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={() => { setShowAddForm(false); setAddForm(EMPTY_FORM); setAddError(''); }}
              className="px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              {/* [UI TEXT - can be translated to Nepali] */}
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Parents Table */}
      {parents.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {/* [UI TEXT - can be translated to Nepali] */}
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Parent Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Class</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {parents.map((parent) => {
                  const isEditing = editingId === parent.id;

                  return (
                    <tr key={parent.id} className={`hover:bg-gray-50 ${!parent.isActive ? 'opacity-50' : ''}`}>
                      {/* Student Name */}
                      <td className="px-6 py-4 text-sm text-gray-900">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editForm.studentName}
                            onChange={(e) => setEditForm({ ...editForm, studentName: e.target.value })}
                            className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500"
                          />
                        ) : (
                          parent.studentName
                        )}
                      </td>

                      {/* Parent Name */}
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {isEditing ? (
                          <input
                            type="text"
                            value={editForm.parentName}
                            onChange={(e) => setEditForm({ ...editForm, parentName: e.target.value })}
                            className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500"
                          />
                        ) : (
                          parent.parentName
                        )}
                      </td>

                      {/* Phone */}
                      <td className="px-6 py-4 text-sm font-mono text-gray-700">
                        {isEditing ? (
                          <input
                            type="tel"
                            value={editForm.phone}
                            onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                            className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500"
                          />
                        ) : (
                          maskPhone(parent.phone)
                        )}
                      </td>

                      {/* Class */}
                      <td className="px-6 py-4 text-sm text-gray-700">
                        {isEditing ? (
                          <select
                            value={editForm.classId}
                            onChange={(e) => setEditForm({ ...editForm, classId: e.target.value })}
                            className="w-full px-2 py-1.5 border border-gray-300 rounded text-sm focus:ring-1 focus:ring-blue-500"
                          >
                            {/* [UI TEXT - can be translated to Nepali] */}
                            <option value="">— None —</option>
                            {classes.map((c) => (
                              <option key={c.id} value={c.id}>{classLabel(c)}</option>
                            ))}
                          </select>
                        ) : (
                          classLabel(parent.class)
                        )}
                      </td>

                      {/* Status */}
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            parent.isActive
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {/* [UI TEXT - can be translated to Nepali] */}
                          {parent.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {isEditing ? (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => handleEditSave(parent.id)}
                              disabled={editSubmitting}
                              className="text-xs px-3 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 transition-colors"
                            >
                              {/* [UI TEXT - can be translated to Nepali] */}
                              {editSubmitting ? 'Saving...' : 'Save'}
                            </button>
                            <button
                              onClick={() => setEditingId(null)}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-3">
                            {parent.isActive && (
                              <>
                                <button
                                  onClick={() => handleEditStart(parent)}
                                  className="text-blue-600 hover:text-blue-900"
                                  title="Edit"
                                >
                                  <Edit2 className="h-4 w-4" />
                                </button>
                                <button
                                  onClick={() => handleDeactivate(parent.id)}
                                  className="text-orange-500 hover:text-orange-700 text-xs font-medium"
                                  title="Deactivate"
                                >
                                  {/* [UI TEXT - can be translated to Nepali] */}
                                  Deactivate
                                </button>
                              </>
                            )}
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty state */}
      {parents.length === 0 && !error && (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
            <Users className="h-8 w-8 text-gray-400" />
          </div>
          {/* [UI TEXT - can be translated to Nepali] */}
          <h3 className="text-lg font-medium text-gray-900 mb-2">No parents added yet</h3>
          <p className="text-gray-500 mb-6 max-w-sm mx-auto text-sm">
            Add parents to start sending WhatsApp notifications.
          </p>
          <button
            onClick={() => { setShowAddForm(true); setAddError(''); }}
            className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2.5 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-5 w-5" />
            {/* [UI TEXT - can be translated to Nepali] */}
            <span>Add Parent</span>
          </button>
        </div>
      )}
    </div>
  );
}
