'use client'
import styles from './Table.module.css'
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownSection,
  DropdownItem,Button
} from "@nextui-org/react";

export function Table({ data, column }) {
  return (
    <>

  <Dropdown >
    <DropdownTrigger>
     <div className='flex' style={{ overflowX: 'auto' }}>
       <div className={styles.columnCell} style={{ flex: 100 }}>id</div>
       <div className={styles.columnCell} style={{ flex: 100 }}>user</div>
       <div className={styles.columnCell} style={{ flex: 800 }}>user</div>
       <div className={styles.columnCell} style={{ flex: 500 }}>user</div>
     </div>
    </DropdownTrigger>
    <DropdownMenu aria-label="Static Actions">
      <DropdownItem key="new">New file</DropdownItem>
      <DropdownItem key="copy">Copy link</DropdownItem>
      <DropdownItem key="edit">Edit file</DropdownItem>
      <DropdownItem key="delete" className="text-danger" color="danger">
        Delete file
      </DropdownItem>
    </DropdownMenu>
  </Dropdown>

        
       
    </>
  );
}
