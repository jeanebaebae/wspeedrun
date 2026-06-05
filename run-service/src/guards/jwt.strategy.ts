import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET || 'secret',
    });
  }

  async validate(payload: any) {
    console.log('JWT PAYLOAD:', payload);

    const userId =
      payload.user_id ||
      payload.userId ||
      payload.id ||
      payload.sub;

    return {
      user_id: userId,
      id: userId,
      sub: userId,
      role: payload.role,
    };
  }
}