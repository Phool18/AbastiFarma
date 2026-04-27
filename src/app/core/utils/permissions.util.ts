import {
  EstadoSolicitud,
  SolicitudReposicion,
  SolicitudReposicionDetalle
} from '../models/solicitud-reposicion.model';
import { UsuarioSesion } from '../models/usuario.model';

export function canCreateSolicitud(user: UsuarioSesion | null): boolean {
  if (!user) {
    return false;
  }

  return user.rol === 'ADMIN' || user.rol === 'BOTICA';
}

export function canViewSedeFilter(user: UsuarioSesion | null): boolean {
  if (!user) {
    return false;
  }

  return user.rol !== 'BOTICA';
}

export function canApproveSolicitud(
  user: UsuarioSesion | null,
  solicitud: SolicitudReposicion | SolicitudReposicionDetalle | null
): boolean {
  return (
    !!user &&
    !!solicitud &&
    user.rol === 'OPERACIONES' &&
    solicitud.estado === 'REGISTRADA'
  );
}

export function canRejectSolicitud(
  user: UsuarioSesion | null,
  solicitud: SolicitudReposicion | SolicitudReposicionDetalle | null
): boolean {
  return !!user && !!solicitud && user.rol === 'OPERACIONES' && solicitud.estado === 'REGISTRADA';
}

export function canAttendSolicitud(
  user: UsuarioSesion | null,
  solicitud: SolicitudReposicion | SolicitudReposicionDetalle | null
): boolean {
  return (
    !!user &&
    !!solicitud &&
    user.rol === 'ALMACEN' &&
    solicitud.estado === 'APROBADA'
  );
}

export function isValidStatusTransition(
  currentStatus: EstadoSolicitud,
  nextStatus: EstadoSolicitud
): boolean {
  if (currentStatus === 'REGISTRADA') {
    return nextStatus === 'APROBADA' || nextStatus === 'RECHAZADA';
  }

  if (currentStatus === 'APROBADA') {
    return nextStatus === 'ATENDIDA';
  }

  return false;
}

export function filterSolicitudesByUser<T extends SolicitudReposicionDetalle | SolicitudReposicion>(
  solicitudes: T[],
  user: UsuarioSesion | null
): T[] {
  if (!user) {
    return [];
  }

  if (user.rol === 'BOTICA') {
    return solicitudes.filter((solicitud) => solicitud.sedeId === user.sedeId);
  }

  return solicitudes;
}
