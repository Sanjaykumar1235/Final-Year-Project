// zoom.controller.ts
// -----------------------------------------------------------------------------
// AUTO-GENERATED CONTROLLER FILE.
// DO NOT modify the auto-generated endpoints below.
// For custom integration logic, extend the helper "performzoomAction".
//
// Copyright (c) 2025 Smackcoders. All rights reserved.
// This file is subject to the Smackcoders Proprietary License.
// Unauthorized copying or distribution is strictly prohibited.
// -----------------------------------------------------------------------------

import {
  Controller,
  Post,
  Get,
  Patch,
  Delete,
  Param,
  Body,
  Req,
  Res,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { Request, response, Response } from 'express';

import axios, { Method } from 'axios';
import { randomBytes } from 'crypto';
import * as  qs from 'qs'
import { initializeDB } from '../../../ormconfig';
import { Credentials } from '../../../entities/Credentials';
import { CustomLogger } from '../../../logger/custom.logger';
import { CredentialController } from 'src/credential/credential.controller';
import config, { XappName, modules as xappModules } from './zoom.config';
import { fields } from './zoom.config';


@Controller('zoom')
export class zoomController {
  private logger = new CustomLogger();
  private CredentialController = new CredentialController()

  /**
   * [AUTO-GENERATED] OAuth authorize endpoint.
   * This endpoint initiates the authentication flow.
   * Implement the actual token request and error handling as needed.
   */
  @Post('authorize')
  async authorize(@Body() reqBody: any, @Res() res: Response) {
      if (!reqBody.clientId || !reqBody.redirectUri || !reqBody.clientSecret || !reqBody.name || !reqBody.type || !reqBody.scope) {
          throw new HttpException('Missing OAuth parameters', HttpStatus.BAD_REQUEST);
      }
      try {
          const { clientId, redirectUri, clientSecret, name, type, id } = reqBody;

          const state = randomBytes(16).toString('hex')


          // Construct the OAuth URL.
          // NOTE: Update the URL if your xapp uses a different authentication endpoint.
          const authUrl = `https://zoom.us/oauth/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=${reqBody.scope}&state=${state}`;
          const data = {
              clientId: clientId,
              clientSecret: clientSecret,
              redirectUri: redirectUri,
              state: state,
              name: name
          }
          const credentialRequest = {
              name: name,
              data: data,
              type: type
          }
          if (reqBody.id) {
              await this.CredentialController.updateCredentials(reqBody.id, data)

              this.logger.debug('Credentials with id updated successfully ', reqBody.id)


              return res.status(HttpStatus.OK).send(authUrl);
          } else {
              await this.CredentialController.createCredentials(credentialRequest, res);
              console.log('Credentials stored in database');
              return res.status(HttpStatus.CREATED).send(authUrl);
          }
      } catch (error) {
          this.logger.error('Error in authorize:', error);
          throw new HttpException('Authorization error', HttpStatus.INTERNAL_SERVER_ERROR);
      }
  }

  /**
   * [AUTO-GENERATED] OAuth callback endpoint.
   * Implement token exchange, credential update, and refreshToken handling here.
   */
  @Get('callback')
  async callback(@Req() req: Request, @Res() res: Response) {
      try {
          const code = req.query.code as string;
          const state = req.query.state as string;

          const connection = await initializeDB();
          const credentialRepository = connection.getRepository(Credentials);
          const credential = await credentialRepository
              .createQueryBuilder('sanjay')
              .where("sanjay.auth_data->>'state'=:state", { state })
              .getOne();
          console.log('credential from call back', credential)

          if (!credential) {
              return res.status(400).json({ message: 'Invalid state:No Credentials found' })
          }

          const { clientId, clientSecret, redirectUri } = credential.auth_data
          const requestBody = qs.stringify({
              grant_type: 'authorization_code',
              client_id: clientId,
              client_secret: clientSecret,
              redirect_uri: redirectUri,
              code: code
          })
          const result = await axios.post(`https://zoom.us/oauth/token`, requestBody, {
              headers: {
                  'Content-Type': 'application/x-www-form-urlencoded',
              }
          });
          credential.auth_data['token'] = result.data


          await this.CredentialController.updateCredentials(credential.id, credential.auth_data)
          return res.send({ message: 'Authorization Completed', })


          // TODO: Implement token exchange using the provided code.
          // NOTE: Save the access token and handle refresh token logic.
      } catch (error) {
          this.logger.error('Error in callback:', error);
          throw new HttpException('Callback error', HttpStatus.INTERNAL_SERVER_ERROR);
      }
  }

  /**
   * [AUTO-GENERATED] Refresh token endpoint.
   * This endpoint should handle token expiry and refresh the access token.
   * Implement the refresh logic based on your authentication provider.
   */
  @Post('refreshToken')
  async refreshToken(@Body() reqBody: any) {
      if (!reqBody.credentialId) {
          throw new HttpException('Missing credential ID', HttpStatus.BAD_REQUEST);
      }
      try {

          const { credentialId } = reqBody


          const newAccessToken = 'new-access-token-placeholder';
          const connection = await initializeDB();
          const credRepository = connection.getRepository(Credentials);
          const credential: any = await credRepository.findOne({ where: { id: credentialId } })

          const data = qs.stringify({
              client_id: credential.auth_data.clientId,
              client_secret: credential.auth_data.clientSecret,
              grant_type: 'refresh_token',
              refresh_token: credential.auth_data.token.refresh_token
          })
          const tokenUrl = `https://zoom.us/oauth/token`;
          const response = await axios.post(tokenUrl, data, {
              headers: {
                  "Content-Type": 'application/x-www-form-urlencoded'
              }
          });
          const result = response.data

          const updatedAuthData = {
              ...credential.auth_data,
              token: result

          };
          await this.CredentialController.updateCredentials(credentialId, updatedAuthData)




          // TODO: Implement the refresh token logic here.
          // Example: Request a new access token using the refresh token.

          return   {accessToken: newAccessToken}
         

      } catch (error) {
          this.logger.error('Error in refreshToken:', error);
          throw new HttpException('Refresh token error', HttpStatus.INTERNAL_SERVER_ERROR);
      }
  }

  async AuthError(functionName: string, functionArgs: any[], credentialsId: string) {
    try {
        await this.refreshToken(credentialsId);
        const argsArray = Array.isArray(functionArgs) ? functionArgs : [functionArgs];
        const result = await this[functionName](...argsArray);
        return result;
    } catch (error) {
        this.logger.error('Error refreshing token:', error + error.stack);
        return error;
    }
} 







  @Post('meeting/create')
  async createMeeting(@Body() data: any, @Res() res: Response) {
      if (!data) {
          throw new HttpException('Request body cannot be empty', HttpStatus.BAD_REQUEST);
      }
      try {
          const result = await this.performzoomAction(`users/${data.data.userId}/meetings`, 'create', 'POST', data);
          if (result.status === 401) {
              const functionArgs = Array.from(arguments).slice(0, 2);
              const result = await this.AuthError("createMeeting", functionArgs, data.credentialId)
          }

          return res.status(HttpStatus.OK).json({
              message: `zoom meeting create executed successfully`,
              result,
          });
      } catch (error) {
          this.logger.error(`Error in meeting/create:`, error);
          throw new HttpException(
              error.message || 'Internal server error',
              HttpStatus.INTERNAL_SERVER_ERROR
          );
      }
  }



  /**
   * [AUTO-GENERATED] Endpoint for module "meeting" action "delete".
   *  - Request Parameters (data): 
   * - CredentialId: string
   * - RecordId: string (ID of the record to delete)
   * - Calls the integration helper "performzoomAction".
   * DO NOT modify the method signature.
   *  Example usage:
   *  {
  "credentialId":"{{credentialId}}",
  "data":{
      "meetingId":86589910387
  }
}
   */


  @Post('meeting/delete')
  async deleteMeeting(@Body() data: any, @Res() res: Response) {
      if (!data) {
          throw new HttpException('Request body cannot be empty', HttpStatus.BAD_REQUEST);
      }
      try {
          const result = await this.performzoomAction(`meetings/${data.data.meetingId}`, 'delete', 'DELETE', data);
          if (result.status === 401) {
              const functionArgs = Array.from(arguments).slice(0, 2);
              const result = await this.AuthError("deleteMeeting", functionArgs, data.credentialId)
              return result
          }
          return res.status(HttpStatus.OK).json({
              message: `zoom meeting delete executed successfully`,
              result,
          });
      } catch (error) {
          this.logger.error(`Error in meeting/delete:`, error);
          throw new HttpException(
              error.message || 'Internal server error',
              HttpStatus.INTERNAL_SERVER_ERROR
          );
      }
  }


/** 
   * [AUTO-GENERATED] Endpoint for module "meeting" action "getMany".
   *  - Request Parameters (data): 
   * - CredentialId: string
   * - Filters: object (optional filters for querying records)
   * - Calls the integration helper "performzoomAction".
   * DO NOT modify the method signature.
   *  Example usage:
   *  {
  "credentialId":"{{credentialId}}",
  "data":{
      "userId":"zy7OTJvFT8KkVfTCB04TwA"
  }
}
   */


  @Post('meeting/getMany')
  async getmanyMeeting(@Body() data: any, @Res() res: Response) {
      if (!data) {
          throw new HttpException('Request body cannot be empty', HttpStatus.BAD_REQUEST);
      }
      try {
          const result = await this.performzoomAction(`/users/${data.data.userId}/meetings`, 'getMany', 'GET', data);
          if (result.status === 401) {
              const functionArgs = Array.from(arguments).slice(0, 2);
              const result = await this.AuthError("getmanyMeeting", functionArgs, data.credentialId)
              return result
          }
          return res.status(HttpStatus.OK).json({
              message: `zoom meeting getMany executed successfully`,
              result,
          });
      } catch (error) {
          this.logger.error(`Error in meeting/getMany:`, error);
          throw new HttpException(
              error.message || 'Internal server error',
              HttpStatus.INTERNAL_SERVER_ERROR
          );
      }
  }




 




  public async initialize(credentialId) {
      try {
          const id: any = credentialId;
          const connection = await initializeDB();
          const credRepository = connection.getRepository(Credentials);
          const credentialRepository = await credRepository.findOne({ where: { id } });
          const access_token = credentialRepository.auth_data.token.access_token;
          return access_token;
      } catch (error) {
          this.logger.error('Error initializing Node:', error + error.stack);
      }
  }

  //  GetFields

  async getAllMeeting(@Body() data: any) {
      if (!data) {
          throw new HttpException('Request body cannot be empty', HttpStatus.BAD_REQUEST);
      }
      try {
          const result = await this.performzoomAction(`/users/${data.data.userId}/meetings`, 'getMany', 'GET', data);
          if (result.status === 401) {
              const functionArgs = Array.from(arguments).slice(0, 2);
              const result = await this.AuthError("getAllMeeting", functionArgs, data.credentialId)
              return result
          }
          return { response: result.response.meetings.map(meetings => ({ value: meetings.id, name: meetings.topic })) }
      } catch (error) {
          this.logger.error(`Error in meeting/getMany:`, error);
          throw new HttpException(
              error.message || 'Internal server error',
              HttpStatus.INTERNAL_SERVER_ERROR
          );
      }
  }

  /**
   * [AUTO-GENERATED] Helper method to perform a zoom action.
   * This method is a stub—extend it to integrate with the actual API for your xapp.
   *
   * Validations:
   * - Ensure that the provided module and action are supported.
   * - Validate the "data" structure as needed.
   *
   * DO NOT change the method signature.
   */
  private async performzoomAction(module: string, action: string, method: string, data: any): Promise<any> {
      // TODO: Implement the actual integration logic.
      // For example:
      // 1. Initialize your API client using a refresh token or saved credentials.
      // 2. Validate that 'data' contains required fields (CredentialId, ModuleId, ModuleData).
      // 3. Use the correct HTTP method based on the action (GET, POST, PATCH, DELETE, etc.).
      // 4. Handle errors and return the API response.
      // 5. If the access token is expired, call the refreshToken endpoint.
      const resultData = await this.curl(module, action, method, data);

      return resultData

  }
  public async curl(module: string, action: string, method: string, argumentdata: any): Promise<any> {

      try {
          const { credentialId, data } = argumentdata;
          const initializeData = await this.initialize(credentialId)

          const access_token = initializeData;
          const baseUrl = `https://api.zoom.us/v2/`
          let url = `${baseUrl}${module}`

          if (data.Id) url += `/${data.Id}`

          const options: any = {
              method, url, headers: {
                  "Authorization": `Bearer ${access_token}`,
                  "Content-Type": "application/json"
              }
          };
          console.log('opt',options)
          if (action === 'getMany') {
              if (argumentdata) options.params = data
          }
          else {
              if (argumentdata) options.data = data.data
          }
          console.log(options)
          const response = await axios(options)
          return { response: response.data, status: response.status }

      } catch (error) {
          return { response: [error.response?.data || error.message], status: error.status || 500 };
      }
  }
  async handleError(err) {
      return {
          response: [err.response.data],
          status: err.status
      }
  }
  @Post('get/fields')
  async getfields(@Body() body: { category: string; name: string; data: any }) {
      const { category, name, data } = body;
      try {


          const relevantFields = await this.generateFields(category, name, data,);
          return relevantFields;
      } catch (error) {
          return [];
      }
  }

  private async generateFields(category: string, name: string, data: any) {
      if (!fields || !Array.isArray(fields)) {
          throw new Error("Fields array is not defined or is not an array.");
      }
      await initializeFields(data);
      const filteredFields = fields.filter(
          (field) =>
              field.displayOptions &&
              field.displayOptions.show &&
              field.displayOptions.show.category &&
              field.displayOptions.show.category.includes(category) &&
              (field.displayOptions.show.name
                  ? field.displayOptions.show.name.includes(name)
                  : true)
      );
      return filteredFields;
  }



}
async function initializeFields(data) {
  for (const field of fields) {
      if (typeof field.init === 'function') {
          await field.init(data);
      }
  }
}
export const zoom = new zoomController()

//   return {
//     module,
//     action,
//     data,
//     simulated: true,
//   };


