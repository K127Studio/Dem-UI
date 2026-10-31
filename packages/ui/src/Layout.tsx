import { useState, type ElementType, type FormEvent, type ReactNode } from "react";
import { Button } from "@dem-ui/base";
import { Input } from "@dem-ui/base";
import { Icon, useStyles, useUI } from "@dem-ui/foundation";

export interface TabHeadingProps {
  title: ReactNode;
  subtitle?: ReactNode;
  /** With a `buttonHref` or `onButtonClick`, shows the main action. */
  buttonLabel?: ReactNode;
  buttonHref?: string;
  onButtonClick?: () => void;
  buttonIcon?: ReactNode;
  /** More actions, next to the main one. */
  children?: ReactNode;
  className?: string;
}

export function TabHeading({ title, subtitle, buttonLabel, buttonHref, onButtonClick, buttonIcon, children, className }: TabHeadingProps) {
  const s = useStyles("tabHeading");
  const hasButton = buttonLabel && (buttonHref || onButtonClick);
  return (
    <div className={s("root", className)}>
      <div className="min-w-0">
        <h1 className={s("title")}>{title}</h1>
        {subtitle && <p className={s("subtitle")}>{subtitle}</p>}
      </div>
      {(hasButton || children) && (
        <div className={s("actions")}>
          {children}
          {hasButton && (
            <Button href={buttonHref} onClick={onButtonClick} icon={buttonIcon ?? <Icon name="plus" className="h-4 w-4" aria-hidden="true" />}>
              {buttonLabel}
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

export interface SidebarItem {
  name: ReactNode;
  href: string;
  icon?: ElementType<{ className?: string }>;
}

export interface AdminSidebarProps {
  /** Filter by role before passing them: the package knows nothing about RBAC. */
  items: SidebarItem[];
  /** The current path, from the router of the project. */
  pathname?: string;
  /** Replaces the default match (exact, or a sub-path). */
  isActive?: (item: SidebarItem, pathname: string) => boolean;
  logo?: ReactNode;
  footer?: ReactNode;
  /** Open state on mobile. On desktop the sidebar is always visible. */
  isOpen?: boolean;
  onNavigate?: () => void;
  className?: string;
}

const defaultIsActive = (item: SidebarItem, pathname: string) =>
  pathname === item.href || pathname.startsWith(`${item.href}/`);

export function AdminSidebar({ items, pathname = "", isActive = defaultIsActive, logo, footer, isOpen = false, onNavigate, className }: AdminSidebarProps) {
  const { Link } = useUI();
  const s = useStyles("adminSidebar");
  return (
    <aside className={s("root", isOpen && s("rootOpen"), className)}>
      {logo && <div className={s("logo")}>{logo}</div>}
      <nav className={s("nav")}>
        {items.map((item) => {
          const active = isActive(item, pathname);
          const ItemIcon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              aria-current={active ? "page" : undefined}
              className={s("item", active && s("itemActive"))}
            >
              {ItemIcon && <ItemIcon className={s("itemIcon")} />}
              {item.name}
            </Link>
          );
        })}
      </nav>
      {footer && <div className={s("footer")}>{footer}</div>}
    </aside>
  );
}

export interface AdminHeaderProps {
  title?: ReactNode;
  /** User menu, theme switch and the like. */
  children?: ReactNode;
  onMenuClick?: () => void;
  className?: string;
}

export function AdminHeader({ title, children, onMenuClick, className }: AdminHeaderProps) {
  const { labels } = useUI();
  const s = useStyles("adminHeader");
  return (
    <header className={s("root", className)}>
      <div className={s("start")}>
        {onMenuClick && (
          <Button
            variant="ghost"
            size="icon"
            className={s("menu")}
            aria-label={labels.menu}
            onClick={onMenuClick}
            icon={<Icon name="menu" className="h-5 w-5" aria-hidden="true" />}
          />
        )}
        {title && <div className={s("title")}>{title}</div>}
      </div>
      <div className={s("end")}>{children}</div>
    </header>
  );
}

export interface AdminShellProps {
  sidebar: AdminSidebarProps;
  header?: Omit<AdminHeaderProps, "onMenuClick">;
  children: ReactNode;
  className?: string;
}

export function AdminShell({ sidebar, header, children, className }: AdminShellProps) {
  const [isOpen, setIsOpen] = useState(false);
  const s = useStyles("adminShell");
  return (
    <div className={s("root", className)}>
      {isOpen && <div className={s("backdrop")} onClick={() => setIsOpen(false)} aria-hidden="true" />}
      <AdminSidebar {...sidebar} isOpen={isOpen} onNavigate={() => setIsOpen(false)} />
      <div className={s("main")}>
        <AdminHeader {...header} onMenuClick={() => setIsOpen(true)} />
        <main className={s("content")}>{children}</main>
      </div>
    </div>
  );
}

export interface LoginFormProps {
  /** The sign-in itself. A rejection is shown above the fields. */
  onSubmit: (credentials: { email: string; password: string }) => Promise<void> | void;
  title?: ReactNode;
  subtitle?: ReactNode;
  logo?: ReactNode;
  submitLabel?: ReactNode;
  /** Extra fields or checks: 2FA code, reCAPTCHA notice. */
  children?: ReactNode;
  footer?: ReactNode;
  className?: string;
}

export function LoginForm({ onSubmit, title, subtitle, logo, submitLabel, children, footer, className }: LoginFormProps) {
  const { labels } = useUI();
  const s = useStyles("loginForm");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string>();
  const [isLoading, setIsLoading] = useState(false);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError(undefined);
    setIsLoading(true);
    try {
      await onSubmit({ email, password });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : String(cause));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={s("root", className)}>
      <div className={s("card")}>
        {logo && <div className={s("logo")}>{logo}</div>}
        {title && <h1 className={s("title")}>{title}</h1>}
        {subtitle && <p className={s("subtitle")}>{subtitle}</p>}
        <form onSubmit={submit} className={s("form")}>
          {error && (
            <div role="alert" className={s("error")}>
              {error}
            </div>
          )}
          <Input label={labels.email} type="email" name="email" autoComplete="username" required value={email} onChange={setEmail} />
          <Input label={labels.password} type="password" name="password" autoComplete="current-password" required value={password} onChange={setPassword} />
          {children}
          <Button type="submit" fullWidth isLoading={isLoading}>
            {submitLabel ?? labels.signIn}
          </Button>
        </form>
        {footer && <div className={s("footer")}>{footer}</div>}
      </div>
    </div>
  );
}

export interface ComingSoonPlaceholderProps {
  title?: ReactNode;
  description?: ReactNode;
  icon?: ElementType<{ className?: string }>;
  className?: string;
}

export function ComingSoonPlaceholder({ title, description, icon: CustomIcon, className }: ComingSoonPlaceholderProps) {
  const { labels } = useUI();
  const s = useStyles("comingSoon");
  return (
    <div className={s("root", className)}>
      {CustomIcon ? <CustomIcon className={s("icon")} /> : <Icon name="placeholder" className={s("icon")} />}
      <h2 className={s("title")}>{title ?? labels.comingSoon}</h2>
      {description && <p className={s("description")}>{description}</p>}
    </div>
  );
}
