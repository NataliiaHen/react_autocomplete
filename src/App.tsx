import React, { useCallback, useMemo, useState } from 'react';
import './App.scss';
import cn from 'classnames';
import debounce from 'lodash.debounce';
import { peopleFromServer } from './data/people';
import { DropDown } from './components/DropDown';
import { Person } from './types/Person';

type Props = {
  delay?: number;
};

export const App: React.FC<Props> = ({ delay = 1000 }) => {
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [query, setQuery] = useState('');
  const [appliedQuery, setAppliedQuery] = useState('');
  const [visibleList, setVisibleList] = useState(false);

  const applyQuery = useCallback(
    debounce(setAppliedQuery, delay),
    [],
  );

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    applyQuery(event.target.value);
  };

  const handleSelectedPerson = (person: Person) => {
    setSelectedPerson(person);
    setVisibleList(false);
    setQuery(person.name);
  };

  const filteredPeople = useMemo(() => {
    return peopleFromServer.filter((person) => {
      return person.name.toLowerCase().includes(appliedQuery.toLowerCase());
    });
  }, [appliedQuery]);

  return (
    <main className="section">
      <h1 className="title">
        {selectedPerson ? (
          `${selectedPerson.name} (${selectedPerson.born} = ${selectedPerson.died})`
        ) : (
          'No selected person'
        )}
      </h1>

      <div className={cn('dropdown', { 'is-active': visibleList })}>
        <div className="dropdown-trigger">
          <input
            type="text"
            placeholder="Enter a part of the name"
            className="input"
            value={query}
            onChange={handleQueryChange}
            onFocus={() => setVisibleList(true)}
            onBlur={() => setVisibleList(false)}
          />
        </div>

        <DropDown
          people={filteredPeople}
          onSelect={(person) => handleSelectedPerson(person)}
          isVisible={visibleList}
        />
      </div>
    </main>
  );
};
