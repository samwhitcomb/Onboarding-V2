import React, { useState, useMemo } from 'react'
import { Modal } from '../Modal/Modal'
import { Button } from '../Button/Button'
import { useClubBag, Club } from '../../context/ClubBagContext'
import './ClubBagModal.css'

interface ClubBagModalProps {
  onClose: () => void
}

type ClubType = 'wood' | 'hybrid' | 'iron' | 'wedge'

const CLUB_TYPE_LABELS: Record<ClubType, string> = {
  wood: 'Woods',
  hybrid: 'Hybrids',
  iron: 'Irons',
  wedge: 'Wedges',
}

const CLUB_TYPES: ClubType[] = ['wood', 'hybrid', 'iron', 'wedge']

export const ClubBagModal: React.FC<ClubBagModalProps> = ({ onClose }) => {
  const { mappedClubs, addClub, updateClub, removeClub } = useClubBag()
  const [editingClub, setEditingClub] = useState<Club | null>(null)
  const [isAddingNew, setIsAddingNew] = useState(false)

  // Group clubs by type
  const clubsByType = useMemo(() => {
    const grouped: Record<ClubType, Club[]> = {
      wood: [],
      hybrid: [],
      iron: [],
      wedge: [],
    }
    mappedClubs.forEach((club) => {
      grouped[club.type].push(club)
    })
    // Sort clubs within each type by name/number
    Object.keys(grouped).forEach((type) => {
      grouped[type as ClubType].sort((a, b) => {
        return a.name.localeCompare(b.name)
      })
    })
    return grouped
  }, [mappedClubs])

  const handleEdit = (club: Club) => {
    setEditingClub(club)
    setIsAddingNew(false)
  }

  const handleAddNew = () => {
    setEditingClub(null)
    setIsAddingNew(true)
  }

  const handleCancelEdit = () => {
    setEditingClub(null)
    setIsAddingNew(false)
  }

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to remove this club?')) {
      removeClub(id)
      // Mark that user has customized clubs
      localStorage.setItem('hasCustomizedClubs', 'true')
    }
  }

  const handleSave = (clubData: Omit<Club, 'id'>) => {
    if (editingClub) {
      updateClub(editingClub.id, clubData)
    } else {
      addClub(clubData)
    }
    // Mark that user has customized clubs
    localStorage.setItem('hasCustomizedClubs', 'true')
    handleCancelEdit()
  }

  return (
    <Modal className="club-bag-modal" onClose={onClose} showCloseButton={true}>
      <div className="club-bag-modal__content">
        <h2 className="club-bag-modal__title">My Bag - Customize Clubs</h2>

        {editingClub || isAddingNew ? (
          <ClubEditForm
            club={editingClub}
            onSave={handleSave}
            onCancel={handleCancelEdit}
          />
        ) : (
          <>
            <div className="club-bag-modal__actions">
              <Button variant="primary" onClick={handleAddNew}>
                + Add Club
              </Button>
            </div>

            <div className="club-bag-modal__clubs">
              {CLUB_TYPES.map((type) => {
                const clubs = clubsByType[type]
                if (clubs.length === 0) return null

                return (
                  <div key={type} className="club-bag-modal__type-group">
                    <h3 className="club-bag-modal__type-title">
                      {CLUB_TYPE_LABELS[type]}
                    </h3>
                    <div className="club-bag-modal__club-list">
                      {clubs.map((club) => (
                        <div key={club.id} className="club-bag-modal__club-card">
                          <div className="club-bag-modal__club-info">
                            <div className="club-bag-modal__club-name">
                              {club.number ? `${club.number} ` : ''}{club.name}
                            </div>
                            <div className="club-bag-modal__club-details">
                              {club.brand} {club.model}
                            </div>
                          </div>
                          <div className="club-bag-modal__club-actions">
                            <Button
                              variant="ghost"
                              onClick={() => handleEdit(club)}
                              className="club-bag-modal__edit-button"
                            >
                              Edit
                            </Button>
                            <Button
                              variant="ghost"
                              onClick={() => handleDelete(club.id)}
                              className="club-bag-modal__delete-button"
                            >
                              Delete
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>
    </Modal>
  )
}

interface ClubEditFormProps {
  club: Club | null
  onSave: (clubData: Omit<Club, 'id'>) => void
  onCancel: () => void
}

const ClubEditForm: React.FC<ClubEditFormProps> = ({ club, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Omit<Club, 'id'>>({
    type: club?.type || 'iron',
    name: club?.name || '',
    number: club?.number || '',
    brand: club?.brand || '',
    model: club?.model || '',
    color: club?.color || '#3498DB',
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.name.trim() || !formData.brand.trim() || !formData.model.trim()) {
      alert('Please fill in all required fields')
      return
    }
    onSave(formData)
  }

  return (
    <form className="club-edit-form" onSubmit={handleSubmit}>
      <h3 className="club-edit-form__title">
        {club ? 'Edit Club' : 'Add New Club'}
      </h3>

      <div className="club-edit-form__field">
        <label className="club-edit-form__label">Name *</label>
        <input
          type="text"
          className="club-edit-form__input"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="e.g., 7i, Driver, PW"
          required
        />
      </div>

      <div className="club-edit-form__field">
        <label className="club-edit-form__label">Number</label>
        <input
          type="text"
          className="club-edit-form__input"
          value={formData.number}
          onChange={(e) => setFormData({ ...formData, number: e.target.value })}
          placeholder="e.g., 7, 3w, Pw"
        />
      </div>

      <div className="club-edit-form__field">
        <label className="club-edit-form__label">Type *</label>
        <select
          className="club-edit-form__select"
          value={formData.type}
          onChange={(e) =>
            setFormData({ ...formData, type: e.target.value as ClubType })
          }
          required
        >
          <option value="wood">Wood</option>
          <option value="hybrid">Hybrid</option>
          <option value="iron">Iron</option>
          <option value="wedge">Wedge</option>
        </select>
      </div>

      <div className="club-edit-form__field">
        <label className="club-edit-form__label">Brand *</label>
        <input
          type="text"
          className="club-edit-form__input"
          value={formData.brand}
          onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
          placeholder="e.g., Callaway, Taylormade"
          required
        />
      </div>

      <div className="club-edit-form__field">
        <label className="club-edit-form__label">Model *</label>
        <input
          type="text"
          className="club-edit-form__input"
          value={formData.model}
          onChange={(e) => setFormData({ ...formData, model: e.target.value })}
          placeholder="e.g., Epic Force, Stealth 2"
          required
        />
      </div>

      <div className="club-edit-form__actions">
        <Button variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="primary" onClick={onSubmit}>
          {club ? 'Save Changes' : 'Add Club'}
        </Button>
      </div>
    </form>
  )
}

