export function BasicArea({ header, body, footer }) {
  return (
    <>
      <div className="screen">
        <div className="flex flex-col-reverse pt-12 w-full" style={{ flex: 6 }}>
          {header}
        </div>

        <div className="pb-12 w-full" style={{ flex: 10 }}>
          {body}
        </div>

        <div className="pb-8 pt-6 w-full">{footer}</div>
      </div>
    </>
  );
}
