import { VALUES } from "@/content/values";

/** The three values in three columns, numbered. */
export function ValueList() {
    return (
        <ol className="value-list value-list-flat">
            {VALUES.map((value, i) => (
                <li key={value.id} id={value.id} className="value">
                    <span className="value-n" aria-hidden="true">
                        {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="title-3 value-title">{value.title}</h3>
                    <p className="body-text">{value.body}</p>
                </li>
            ))}
        </ol>
    );
}
