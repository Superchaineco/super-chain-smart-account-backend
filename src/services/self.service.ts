import {
  AllIds,
  AttestationId,
  DefaultConfigStore,
  IConfigStorage,
  SelfBackendVerifier,
  VerificationConfig,
} from '@selfxyz/core';
import { redisService } from './redis.service';
import { getAccountByAddress } from './account.service';
import { ENV, ENVIRONMENTS } from '@/config/superChain/constants';

export class SelfService {
  public async selfVerify(
    userIdentifier: string,
    proof: any,
    publicSignals: string[],
    attestationId: AttestationId,
    userContextData: any
  ): Promise<SelfVerifyResponse> {
    const configStore = new DefaultConfigStore({
      excludedCountries: [],
    });

    const selfBackendVerifier = new SelfBackendVerifier(
      'super-accounts',
      //   'https://8e40ac4d6618.ngrok-free.app/api/self/verify',
      ((ENV === ENVIRONMENTS.production) ?
        'https://scsa-backend-production.up.railway.app//api/self/verify' :
        'https://scsa-backend-staging.up.railway.app/api/self/verify'),
      (ENV === ENVIRONMENTS.production) ? false : true,
      AllIds,
      configStore,
      'uuid'
    );

    const result = await selfBackendVerifier.verify(
      attestationId,
      proof,
      publicSignals,
      userContextData
    );

    if (result.isValidDetails.isValid) {
      console.log('Verification successful:', result.isValidDetails);

      const filteredSubject = { ...result.discloseOutput };
      const cache_key = `self_id_pre:${userIdentifier}`;
      redisService.setCachedData(cache_key, filteredSubject, 0);

      return {
        isValid: true,
        details: result.isValidDetails,
        credentialSubject: filteredSubject,
      };
    } else {
      console.log('Verification failed:', result.isValidDetails);
      return {
        isValid: false,
        details: result.isValidDetails,
        credentialSubject: undefined,
      };
    }
  }

  public async selfCheck(
    userId: string,
    address: string
  ): Promise<SelfCheckResponse> {


    const cache_pre_key = `self_id_pre:${userId}`;
    const accountData = await getAccountByAddress(address)
    const selfData =
      (await redisService.getCachedData(cache_pre_key)) ?? accountData?.nationality;

    console.log('Checking self data for userId:', userId, selfData);
    console.log(selfData != null);
    if (selfData != null && Object.keys(selfData).length > 0) {
      console.log('Validation success!:', userId, selfData);
      return { message: 'Validation success!', check: true, data: selfData };
    }
    console.log('Self data not found!:', userId, selfData);
    return { message: 'Self data not found', check: false };
  }
}

export type SelfCheckResponse = {
  check: boolean;
  message?: string;
  data?: any;
};

export type SelfVerifyResponse = {
  isValid: boolean;
  credentialSubject?: any;
  details?: any;
};
